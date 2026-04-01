import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import morenaLogo from '../assets/morena-logo-original.png'

const BRAND = {
  black: [9, 9, 10],
  panel: [17, 17, 18],
  panelSoft: [26, 26, 28],
  white: [245, 245, 245],
  softWhite: [220, 220, 224],
  muted: [132, 132, 138],
  line: [54, 54, 58],
  accent: [198, 198, 204]
}

let brandLogoDataUrlPromise

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

const getBrandLogoDataUrl = async () => {
  if (!brandLogoDataUrlPromise) {
    brandLogoDataUrlPromise = fetch(morenaLogo)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
      )
  }

  return brandLogoDataUrlPromise
}

const drawBrandHeader = async (pdf, title, subtitle = 'MORENA CONCEPT') => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const logoDataUrl = await getBrandLogoDataUrl()

  pdf.setFillColor(...BRAND.black)
  pdf.rect(0, 0, pageWidth, 38, 'F')

  pdf.setDrawColor(...BRAND.line)
  pdf.line(14, 31, pageWidth - 14, 31)

  pdf.addImage(logoDataUrl, 'PNG', 14, 7, 18, 18)

  pdf.setTextColor(...BRAND.white)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(15)
  pdf.text(subtitle, 38, 14)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...BRAND.muted)
  pdf.text('Documento comercial', 38, 20)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(...BRAND.white)
  pdf.text(title, pageWidth - 14, 15, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...BRAND.softWhite)
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 14, 21, { align: 'right' })

  return 42
}

const drawBrandFooter = (pdf) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  pdf.setDrawColor(...BRAND.line)
  pdf.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)
  pdf.setTextColor(...BRAND.muted)
  pdf.setFontSize(8)
  pdf.text('MORENA CONCEPT • ERP', 14, pageHeight - 9)
  pdf.text(`Pagina ${pdf.getCurrentPageInfo().pageNumber}`, pageWidth - 14, pageHeight - 9, { align: 'right' })
}

const drawPageShell = async (pdf, title, subtitle) => {
  const y = await drawBrandHeader(pdf, title, subtitle)
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
    const topY = await drawPageShell(pdf, 'Exportacao visual', 'MORENA CONCEPT')
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = topY

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - (topY + 20)

    while (heightLeft >= 0) {
      pdf.addPage()
      const pageTopY = await drawPageShell(pdf, 'Exportacao visual', 'MORENA CONCEPT')
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

export async function generateSimpleTablePDF(title, headers, rows, filename) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = await drawPageShell(pdf, title, 'MORENA CONCEPT')

  pdf.setFontSize(9)
  pdf.setTextColor(...BRAND.muted)
  pdf.text(`Total de registros: ${rows.length}`, 14, yPosition)
  yPosition += 10

  pdf.setFontSize(10)
  const cellWidth = (pageWidth - 28) / headers.length
  const cellHeight = 8

  pdf.setFillColor(...BRAND.panel)
  pdf.setTextColor(...BRAND.white)
  headers.forEach((header, index) => {
    pdf.roundedRect(14 + index * cellWidth, yPosition, cellWidth, cellHeight, 1.5, 1.5, 'F')
    pdf.text(header, 16 + index * cellWidth, yPosition + 5.2, { maxWidth: cellWidth - 4 })
  })
  yPosition += cellHeight + 2

  pdf.setTextColor(32, 32, 32)
  let alternateColor = false

  for (const row of rows) {
    if (yPosition > pageHeight - 20) {
      pdf.addPage()
      yPosition = await drawPageShell(pdf, title, 'MORENA CONCEPT')
    }

    if (alternateColor) {
      pdf.setFillColor(242, 242, 244)
      pdf.roundedRect(14, yPosition - 1.5, pageWidth - 28, cellHeight, 1.2, 1.2, 'F')
    }

    row.forEach((cell, index) => {
      pdf.text(String(cell), 16 + index * cellWidth, yPosition + 4.5, {
        maxWidth: cellWidth - 4
      })
    })

    yPosition += cellHeight
    alternateColor = !alternateColor
  }

  drawBrandFooter(pdf)
  pdf.save(`${filename}.pdf`)
}

export async function generateOrderPDF({ title, customerName, notes, dueDate, paymentNotes, items, total, filename }) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let y = await drawPageShell(pdf, title || 'Pedido', 'MORENA CONCEPT')

  pdf.setFillColor(...BRAND.panel)
  pdf.roundedRect(14, y, pageWidth - 28, 34, 4, 4, 'F')

  pdf.setTextColor(...BRAND.softWhite)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('CLIENTE', 18, y + 8)
  pdf.text('PAGAMENTO', 108, y + 8)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...BRAND.white)
  pdf.text(customerName || 'Nao informado', 18, y + 15)
  pdf.text(`Vencimento: ${dueDate || 'Sem vencimento'}`, 108, y + 15)

  pdf.setTextColor(...BRAND.accent)
  const wrappedPayment = pdf.splitTextToSize(paymentNotes || 'Sem observacoes financeiras', pageWidth - 122)
  pdf.text(wrappedPayment, 108, y + 22)
  y += 42

  if (notes) {
    pdf.setFillColor(244, 244, 246)
    const wrappedNotes = pdf.splitTextToSize(notes, pageWidth - 36)
    const noteHeight = Math.max(16, wrappedNotes.length * 5 + 8)
    pdf.roundedRect(14, y, pageWidth - 28, noteHeight, 3, 3, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...BRAND.panelSoft)
    pdf.text('OBSERVACOES', 18, y + 7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 65)
    pdf.text(wrappedNotes, 18, y + 13)
    y += noteHeight + 8
  }

  pdf.setFillColor(...BRAND.black)
  pdf.setTextColor(...BRAND.white)
  pdf.roundedRect(14, y, pageWidth - 28, 10, 2, 2, 'F')
  pdf.text('Produto', 18, y + 6.2)
  pdf.text('Qtd', 118, y + 6.2)
  pdf.text('Unitario', 142, y + 6.2)
  pdf.text('Subtotal', 171, y + 6.2)
  y += 14

  pdf.setTextColor(28, 28, 30)
  for (const [index, item] of items.entries()) {
    if (y > pageHeight - 30) {
      pdf.addPage()
      y = await drawPageShell(pdf, title || 'Pedido', 'MORENA CONCEPT')

      pdf.setFillColor(...BRAND.black)
      pdf.setTextColor(...BRAND.white)
      pdf.roundedRect(14, y, pageWidth - 28, 10, 2, 2, 'F')
      pdf.text('Produto', 18, y + 6.2)
      pdf.text('Qtd', 118, y + 6.2)
      pdf.text('Unitario', 142, y + 6.2)
      pdf.text('Subtotal', 171, y + 6.2)
      y += 14
    }

    pdf.setFillColor(index % 2 === 0 ? 247 : 238, index % 2 === 0 ? 247 : 238, index % 2 === 0 ? 249 : 240)
    pdf.roundedRect(14, y - 5, pageWidth - 28, 10, 1.8, 1.8, 'F')

    pdf.text(String(item.name), 18, y)
    pdf.text(String(item.quantity), 120, y)
    pdf.text(formatCurrency(item.unitPrice), 142, y)
    pdf.text(formatCurrency(item.subtotal), 171, y)
    y += 11
  }

  y += 3
  pdf.setFillColor(...BRAND.black)
  pdf.roundedRect(126, y, pageWidth - 140, 16, 3, 3, 'F')
  pdf.setTextColor(...BRAND.softWhite)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.text('TOTAL DO PEDIDO', pageWidth - 18, y + 5.5, { align: 'right' })
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(...BRAND.white)
  pdf.text(formatCurrency(total), pageWidth - 18, y + 12, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...BRAND.muted)
  pdf.text('Documento gerado pelo ERP Morena Concept', 14, pageHeight - 18)

  drawBrandFooter(pdf)
  pdf.save(`${filename}.pdf`)
}
