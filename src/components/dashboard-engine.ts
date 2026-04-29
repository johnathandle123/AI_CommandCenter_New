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
  const rowMap = new Map<number, LayoutCard[]>()
  sorted.forEach(c => {
    if (!rowMap.has(c.row)) rowMap.set(c.row, [])
    rowMap.get(c.row)!.push(c)
  })
  const rows: RowData[] = []
  const keys = [...rowMap.keys()].sort((a, b) => a - b)
  keys.forEach((key, ri) => {
    const rowCards = rowMap.get(key)!
    const n = rowCards.length
    const w = Math.floor(MAX_COLS / n)
    const remainder = MAX_COLS - w * n
    let x = 0
    const distributed = rowCards.map((c, ci) => {
      const cw = w + (ci < remainder ? 1 : 0)
      const card = { ...c, row: ri, col: ci, w: cw }
      x += cw
      return card
    })
    const height = Math.max(...distributed.map(c => c.h), 2)
    rows.push({ cards: distributed, height })
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
  mouseXFrac: number, // 0-1 across container width
  mouseY: number,     // px from top of grid
  rowHeight: number,
  gap: number
): DropZone | null {
  let yOffset = 0

  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri]
    const rh = row.height * rowHeight
    const rowTop = yOffset
    const rowMid = yOffset + rh / 2
    const rowBottom = yOffset + rh

    // Above row (top 10px zone)
    if (mouseY >= rowTop - gap / 2 && mouseY < rowTop + 10) {
      return { type: 'above-row', rowIndex: ri }
    }

    // Within row
    if (mouseY >= rowTop && mouseY < rowBottom) {
      // Check each card in the row
      let xStart = 0
      for (let ci = 0; ci < row.cards.length; ci++) {
        const card = row.cards[ci]
        if (card.id === draggedId) { xStart += card.w / MAX_COLS; continue }
        const cardLeft = xStart
        const cardRight = xStart + card.w / MAX_COLS
        const cardMid = (cardLeft + cardRight) / 2
        const edgeZone = (cardRight - cardLeft) * 0.2 // 20% edges for between

        if (mouseXFrac >= cardLeft && mouseXFrac < cardRight) {
          // Left edge → insert before
          if (mouseXFrac < cardLeft + edgeZone) {
            return { type: 'between', rowIndex: ri, insertAt: ci }
          }
          // Right edge → insert after
          if (mouseXFrac > cardRight - edgeZone) {
            return { type: 'between', rowIndex: ri, insertAt: ci + 1 }
          }
          // Center → swap
          return { type: 'swap', targetId: card.id, rowIndex: ri }
        }
        xStart = cardRight
      }
      // Past all cards → insert at end
      return { type: 'between', rowIndex: ri, insertAt: row.cards.length }
    }

    // Below row (bottom gap zone)
    if (mouseY >= rowBottom && mouseY < rowBottom + gap) {
      return { type: 'below-row', rowIndex: ri }
    }

    yOffset = rowBottom + gap
  }

  // Below everything
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
    // Remove dragged from current position
    const without = allCards.filter(c => c.id !== draggedId)
    const tempRows = buildRows(without)
    const targetRow = tempRows[zone.rowIndex]

    if (targetRow) {
      // Insert into row at position
      const insertCol = Math.min(zone.insertAt, targetRow.cards.length)
      targetRow.cards.splice(insertCol, 0, { ...dragged, row: zone.rowIndex, col: insertCol })

      // If row exceeds max, push last card to next row
      if (targetRow.cards.length > MAX_PER_ROW) {
        const overflow = targetRow.cards.pop()!
        overflow.row = zone.rowIndex + 1
        overflow.col = 0
        // Insert overflow into next row
        if (zone.rowIndex + 1 < tempRows.length) {
          tempRows[zone.rowIndex + 1].cards.unshift(overflow)
          // Cascade if needed
          cascadeOverflow(tempRows, zone.rowIndex + 1)
        } else {
          tempRows.push({ cards: [overflow], height: overflow.h })
        }
      }
    } else {
      // New row
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
