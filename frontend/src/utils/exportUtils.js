import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const BRAND = {
  ink: [22, 19, 20],
  panel: [33, 29, 31],
  pink: [255, 67, 163],
  red: [237, 50, 55],
  orange: [245, 134, 52],
  text: [244, 239, 239],
  muted: [120, 120, 125],
  line: [228, 228, 231]
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

const drawBrandHeader = (pdf, title, subtitle = 'MORENA CONCEPT') => {
  const pageWidth = pdf.internal.pageSize.getWidth()

  pdf.setFillColor(...BRAND.ink)
  pdf.rect(0, 0, pageWidth, 34, 'F')

  pdf.setFillColor(...BRAND.pink)
  pdf.rect(0, 0, pageWidth * 0.34, 3, 'F')
  pdf.setFillColor(...BRAND.red)
  pdf.rect(pageWidth * 0.34, 0, pageWidth * 0.33, 3, 'F')
  pdf.setFillColor(...BRAND.orange)
  pdf.rect(pageWidth * 0.67, 0, pageWidth * 0.33, 3, 'F')

  pdf.setTextColor(...BRAND.text)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.text(subtitle, 14, 15)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text('Imagine a Place', 14, 21)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.text(title, pageWidth - 14, 18, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 14, 24, { align: 'right' })

  return 44
}

const drawBrandFooter = (pdf) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  pdf.setDrawColor(...BRAND.line)
  pdf.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14)
  pdf.setTextColor(...BRAND.muted)
  pdf.setFontSize(8)
  pdf.text('ERP MORENA CONCEPT', 14, pageHeight - 8)
  pdf.text(`Pagina ${pdf.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 8, { align: 'right' })
}

const drawPageShell = (pdf, title, subtitle) => {
  const y = drawBrandHeader(pdf, title, subtitle)
  drawBrandFooter(pdf)
  return y
}

export async function exportToPDF(elementId, filename) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      alert('Elemento nao encontrado para exportacao')
      return
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const topY = drawPageShell(pdf, 'Exportacao visual', 'MORENA CONCEPT')
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = topY

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - (topY + 20)

    while (heightLeft >= 0) {
      pdf.addPage()
      const pageTopY = drawPageShell(pdf, 'Exportacao visual', 'MORENA CONCEPT')
      position = pageTopY - (imgHeight - heightLeft)
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - (pageTopY + 20)
    }

    pdf.save(`${filename}.pdf`)
    alert(`Arquivo exportado: ${filename}.pdf`)
  } catch (error) {
    alert(`Erro ao exportar PDF: ${error.message}`)
  }
}

export function exportTableToCSV(headers, rows, filename) {
  let csv = headers.join(',') + '\n'
  rows.forEach((row) => {
    csv += row.map((cell) => `"${cell}"`).join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generateSimpleTablePDF(title, headers, rows, filename) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = drawPageShell(pdf, title, 'MORENA CONCEPT')

  pdf.setFontSize(9)
  pdf.setTextColor(...BRAND.muted)
  pdf.text(`Total de registros: ${rows.length}`, 14, yPosition)
  yPosition += 10

  pdf.setFontSize(10)
  const cellWidth = (pageWidth - 28) / headers.length
  const cellHeight = 8

  pdf.setFillColor(...BRAND.panel)
  pdf.setTextColor(...BRAND.text)
  headers.forEach((header, index) => {
    pdf.roundedRect(14 + index * cellWidth, yPosition, cellWidth, cellHeight, 1.5, 1.5, 'F')
    pdf.text(header, 16 + index * cellWidth, yPosition + 5.2, { maxWidth: cellWidth - 4 })
  })
  yPosition += cellHeight + 2

  pdf.setTextColor(35, 35, 35)
  let alternateColor = false

  rows.forEach((row) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage()
      yPosition = drawPageShell(pdf, title, 'MORENA CONCEPT')
    }

    if (alternateColor) {
      pdf.setFillColor(248, 248, 249)
      pdf.roundedRect(14, yPosition - 1.5, pageWidth - 28, cellHeight, 1.2, 1.2, 'F')
    }

    row.forEach((cell, index) => {
      pdf.text(String(cell), 16 + index * cellWidth, yPosition + 4.5, {
        maxWidth: cellWidth - 4
      })
    })

    yPosition += cellHeight
    alternateColor = !alternateColor
  })

  pdf.save(`${filename}.pdf`)
}

export function generateOrderPDF({ title, customerName, notes, dueDate, paymentNotes, items, total, filename }) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let y = drawPageShell(pdf, title || 'Pedido', 'MORENA CONCEPT')

  pdf.setFillColor(252, 250, 251)
  pdf.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(...BRAND.panel)
  pdf.text('Cliente', 18, y + 8)
  pdf.text('Pagamento', 108, y + 8)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(customerName || 'Nao informado', 18, y + 15)
  pdf.text(`Vencimento: ${dueDate || 'Sem vencimento'}`, 108, y + 15)
  pdf.text(paymentNotes || 'Sem observacoes financeiras', 108, y + 22)
  y += 38

  if (notes) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('Observacoes', 14, y)
    y += 5
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...BRAND.muted)
    const wrappedNotes = pdf.splitTextToSize(notes, pageWidth - 28)
    pdf.text(wrappedNotes, 14, y)
    y += wrappedNotes.length * 5 + 5
  }

  pdf.setFillColor(...BRAND.panel)
  pdf.setTextColor(...BRAND.text)
  pdf.roundedRect(14, y, pageWidth - 28, 9, 2, 2, 'F')
  pdf.text('Produto', 18, y + 5.8)
  pdf.text('Qtd', 120, y + 5.8)
  pdf.text('Unitario', 144, y + 5.8)
  pdf.text('Subtotal', 173, y + 5.8)
  y += 13

  pdf.setTextColor(35, 35, 35)
  items.forEach((item, index) => {
    if (y > pageHeight - 24) {
      pdf.addPage()
      y = drawPageShell(pdf, title || 'Pedido', 'MORENA CONCEPT')
    }

    if (index % 2 === 0) {
      pdf.setFillColor(250, 247, 248)
      pdf.roundedRect(14, y - 4.8, pageWidth - 28, 9, 1.5, 1.5, 'F')
    }

    pdf.text(String(item.name), 18, y)
    pdf.text(String(item.quantity), 122, y)
    pdf.text(formatCurrency(item.unitPrice), 144, y)
    pdf.text(formatCurrency(item.subtotal), 173, y)
    y += 9
  })

  y += 4
  pdf.setDrawColor(...BRAND.line)
  pdf.line(120, y, pageWidth - 14, y)
  y += 8

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(...BRAND.pink)
  pdf.text(`Total ${formatCurrency(total)}`, pageWidth - 14, y, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...BRAND.muted)
  pdf.text('Documento gerado pelo ERP Morena Concept', 14, pageHeight - 18)

  pdf.save(`${filename}.pdf`)
}
