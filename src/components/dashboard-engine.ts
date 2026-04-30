// Custom Dashboard Layout Engine v2
// Simple row-based layout with precise drop zones

export type LayoutCard = { id: string; row: number; col: number; w: number; h: number }
export type RowData = { cards: LayoutCard[]; height: number }

const MAX_COLS = 12
const MAX_PER_ROW = 6

// ── Build rows from flat card list ──
export function buildRows(cards: LayoutCard[]): RowData[] {
  if (!cards.length) return []
  const sorted = [...cards].sort((a, b) => a.row - b.row || a.col - b.col)
  
  // Group by row, then enforce max per row
  const rowMap = new Map<number, LayoutCard[]>()
  sorted.forEach(c => {
    if (!rowMap.has(c.row)) rowMap.set(c.row, [])
    rowMap.get(c.row)!.push(c)
  })
  
  // Flatten into sequential rows, splitting any that exceed MAX_PER_ROW
  const rawRows: LayoutCard[][] = []
  const keys = [...rowMap.keys()].sort((a, b) => a - b)
  keys.forEach(key => {
    const rowCards = rowMap.get(key)!
    for (let i = 0; i < rowCards.length; i += MAX_PER_ROW) {
      rawRows.push(rowCards.slice(i, i + MAX_PER_ROW))
    }
  })
  
  // Redistribute widths in each row
  const rows: RowData[] = rawRows.map((rowCards, ri) => {
    const n = rowCards.length
    const w = Math.floor(MAX_COLS / n)
    const remainder = MAX_COLS - w * n
    const distributed = rowCards.map((c, ci) => ({
      ...c, row: ri, col: ci, w: w + (ci < remainder ? 1 : 0)
    }))
    const height = Math.max(...distributed.map(c => c.h), 2)
    return { cards: distributed, height }
  })
  return rows
}

// ── Flatten rows back to cards ──
export function flattenRows(rows: RowData[]): LayoutCard[] {
  return rows.flatMap(r => r.cards)
}

// ── Repack: ensure no empty rows, redistribute widths ──
export function repack(cards: LayoutCard[]): LayoutCard[] {
  return flattenRows(buildRows(cards))
}

// ── Drop Zones ──
export type DropZone =
  | { type: 'swap'; targetId: string; rowIndex: number }
  | { type: 'between'; rowIndex: number; insertAt: number }
  | { type: 'above-row'; rowIndex: number }
  | { type: 'below-row'; rowIndex: number }

export function detectDropZone(
  rows: RowData[],
  draggedId: string,
  mouseXFrac: number,
  mouseY: number,
  rowHeight: number,
  gap: number
): DropZone | null {
  let yOffset = 0

  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri]
    const rh = row.height * rowHeight
    const rowTop = yOffset
    const rowBottom = yOffset + rh

    // Above row zone
    if (mouseY >= rowTop - gap && mouseY < rowTop + 8) {
      return { type: 'above-row', rowIndex: ri }
    }

    // Within row
    if (mouseY >= rowTop + 8 && mouseY < rowBottom - 8) {
      let xStart = 0
      for (let ci = 0; ci < row.cards.length; ci++) {
        const card = row.cards[ci]
        const cardLeft = xStart
        const cardRight = xStart + card.w / MAX_COLS
        
        if (card.id === draggedId) {
          xStart = cardRight
          continue
        }

        if (mouseXFrac >= cardLeft && mouseXFrac < cardRight) {
          const cardWidth = cardRight - cardLeft
          // Left 15% = insert before, Right 15% = insert after, Center = swap
          if (mouseXFrac < cardLeft + cardWidth * 0.15) {
            return { type: 'between', rowIndex: ri, insertAt: ci }
          }
          if (mouseXFrac > cardRight - cardWidth * 0.15) {
            return { type: 'between', rowIndex: ri, insertAt: ci + 1 }
          }
          return { type: 'swap', targetId: card.id, rowIndex: ri }
        }
        xStart = cardRight
      }
      // Past all cards
      return { type: 'between', rowIndex: ri, insertAt: row.cards.length }
    }

    // Below row zone
    if (mouseY >= rowBottom - 8 && mouseY < rowBottom + gap) {
      return { type: 'below-row', rowIndex: ri }
    }

    yOffset = rowBottom + gap
  }

  if (rows.length > 0) return { type: 'below-row', rowIndex: rows.length - 1 }
  return null
}

// ── Apply Drop ──
export function applyDrop(
  rows: RowData[],
  draggedId: string,
  zone: DropZone
): LayoutCard[] {
  const allCards = flattenRows(rows)
  const dragged = allCards.find(c => c.id === draggedId)
  if (!dragged) return allCards

  if (zone.type === 'swap') {
    const target = allCards.find(c => c.id === zone.targetId)
    if (!target) return allCards
    // Swap row and col
    return repack(allCards.map(c => {
      if (c.id === draggedId) return { ...c, row: target.row, col: target.col }
      if (c.id === zone.targetId) return { ...c, row: dragged.row, col: dragged.col }
      return c
    }))
  }

  if (zone.type === 'between') {
    const without = allCards.filter(c => c.id !== draggedId)
    const tempRows = buildRows(without)
    const ri = Math.min(zone.rowIndex, tempRows.length - 1)
    const targetRow = tempRows[ri]

    if (targetRow) {
      // Adjust insertAt: if dragged was in same row before the insert point, shift down by 1
      const origRow = rows[zone.rowIndex]
      let adjustedInsert = zone.insertAt
      if (origRow) {
        const dragIdx = origRow.cards.findIndex(c => c.id === draggedId)
        if (dragIdx !== -1 && dragIdx < zone.insertAt) adjustedInsert--
      }
      const insertCol = Math.max(0, Math.min(adjustedInsert, targetRow.cards.length))

      if (targetRow.cards.length < MAX_PER_ROW) {
        targetRow.cards.splice(insertCol, 0, { ...dragged, row: ri, col: insertCol })
      } else {
        // Row is full — insert and push overflow
        targetRow.cards.splice(insertCol, 0, { ...dragged, row: ri, col: insertCol })
        const overflow = targetRow.cards.pop()!
        overflow.row = ri + 1
        overflow.col = 0
        if (ri + 1 < tempRows.length) {
          tempRows[ri + 1].cards.unshift(overflow)
          cascadeOverflow(tempRows, ri + 1)
        } else {
          tempRows.push({ cards: [overflow], height: overflow.h })
        }
      }
    } else {
      tempRows.push({ cards: [{ ...dragged, row: tempRows.length, col: 0 }], height: dragged.h })
    }
    return repack(flattenRows(tempRows))
  }

  if (zone.type === 'above-row' || zone.type === 'below-row') {
    const without = allCards.filter(c => c.id !== draggedId)
    const tempRows = buildRows(without)
    const insertAt = zone.type === 'above-row' ? zone.rowIndex : zone.rowIndex + 1
    // Shift rows down
    tempRows.forEach((r, ri) => { if (ri >= insertAt) r.cards.forEach(c => { c.row = ri + 1 }) })
    // Insert new full-width row
    tempRows.splice(insertAt, 0, { cards: [{ ...dragged, row: insertAt, col: 0, w: MAX_COLS }], height: dragged.h })
    return repack(flattenRows(tempRows))
  }

  return allCards
}

function cascadeOverflow(rows: RowData[], fromRow: number) {
  for (let ri = fromRow; ri < rows.length; ri++) {
    if (rows[ri].cards.length <= MAX_PER_ROW) break
    const overflow = rows[ri].cards.pop()!
    overflow.row = ri + 1
    overflow.col = 0
    if (ri + 1 < rows.length) {
      rows[ri + 1].cards.unshift(overflow)
    } else {
      rows.push({ cards: [overflow], height: overflow.h })
    }
  }
}

// ── Positions for rendering ──
export function getPositions(rows: RowData[], rowHeight: number, gap: number) {
  const positions: Record<string, { x: number; y: number; w: number; h: number }> = {}
  let yOffset = 0
  for (const row of rows) {
    let xFrac = 0
    for (const card of row.cards) {
      positions[card.id] = {
        x: xFrac,
        y: yOffset,
        w: card.w / MAX_COLS,
        h: row.height * rowHeight,
      }
      xFrac += card.w / MAX_COLS
    }
    yOffset += row.height * rowHeight + gap
  }
  return { positions, totalHeight: yOffset }
}
