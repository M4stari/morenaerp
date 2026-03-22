import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(elementId, filename) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      alert('❌ Elemento não encontrado para exportação')
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
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 10

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
    alert(`✅ Arquivo exportado: ${filename}.pdf`)
  } catch (error) {
    alert(`❌ Erro ao exportar PDF: ${error.message}`)
  }
}

export function exportTableToCSV(headers, rows, filename) {
  let csv = headers.join(',') + '\n'
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n'
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
  let yPosition = 20

  // Title
  pdf.setFontSize(16)
  pdf.text(title, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Date
  pdf.setFontSize(10)
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Table
  pdf.setFontSize(11)
  const cellWidth = (pageWidth - 20) / headers.length
  const cellHeight = 7

  // Headers
  pdf.setFillColor(184, 118, 90) // Cor morena
  pdf.setTextColor(255, 255, 255)
  headers.forEach((header, index) => {
    pdf.rect(10 + index * cellWidth, yPosition, cellWidth, cellHeight, 'F')
    pdf.text(header, 10 + index * cellWidth + 2, yPosition + 5, { maxWidth: cellWidth - 4 })
  })
  yPosition += cellHeight

  // Rows
  pdf.setTextColor(0, 0, 0)
  let alternateColor = false
  rows.forEach(row => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage()
      yPosition = 20
    }

    if (alternateColor) {
      pdf.setFillColor(245, 245, 245)
      row.forEach((cell, index) => {
        pdf.rect(10 + index * cellWidth, yPosition, cellWidth, cellHeight, 'F')
      })
    }

    row.forEach((cell, index) => {
      pdf.text(String(cell), 10 + index * cellWidth + 2, yPosition + 5, {
        maxWidth: cellWidth - 4
      })
    })

    yPosition += cellHeight
    alternateColor = !alternateColor
  })

  pdf.save(`${filename}.pdf`)
}
