#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pdfplumber
import json
import os
from PIL import Image
from collections import Counter
import colorsys
import io
import sys

# Definir encoding UTF-8 para stdout
if sys.platform == 'win32':
    import ctypes
    ctypes.windll.kernel32.SetConsoleCP(65001)
    ctypes.windll.kernel32.SetConsoleOutputCP(65001)

def rgb_to_hex(rgb):
    """Converte RGB para HEX"""
    try:
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
    except:
        return None

def rgb_to_cmyk(rgb):
    """Converte RGB para CMYK"""
    try:
        r, g, b = [x / 255.0 for x in rgb]
        k = 1.0 - max(r, g, b)
        if k < 1:
            c = (1.0 - r - k) / (1.0 - k)
            m = (1.0 - g - k) / (1.0 - k)
            y = (1.0 - b - k) / (1.0 - k)
        else:
            c = m = y = 0.0
        return f"C:{int(c*100)}% M:{int(m*100)}% Y:{int(y*100)}% K:{int(k*100)}%"
    except:
        return None

def extract_colors_from_pdf_image(pdf_path):
    """Extrai cores dominantes convertendo PDF em imagens"""
    try:
        from pdf2image import convert_from_path
        import tempfile
        
        print("\n[CONVERSAO] Convertendo PDF em imagens...")
        
        # Converter PDF para imagens com DPI configurado
        images = convert_from_path(pdf_path, dpi=100)
        
        todas_cores = {}
        paginas_processadas = 0
        
        print(f"[TOTAL] {len(images)} paginas para analisar\n")
        
        for page_num, img in enumerate(images, 1):
            sys.stdout.write(f"[{page_num:02d}/{len(images):02d}] Analisando pagina... ")
            sys.stdout.flush()
            
            try:
                # Redimensionar para analise mais rapida
                img_small = img.resize((100, 100))
                pixels = list(img_small.getdata())
                
                # Contar cores
                color_counter = Counter(pixels)
                top_colors = color_counter.most_common(20)
                
                for color, count in top_colors:
                    hex_color = rgb_to_hex(color)
                    
                    if hex_color and hex_color not in todas_cores:
                        todas_cores[hex_color] = {
                            "hex": hex_color,
                            "rgb": f"RGB({color[0]}, {color[1]}, {color[2]})",
                            "cmyk": rgb_to_cmyk(color),
                            "frequencia": 0,
                            "paginas": []
                        }
                    
                    if hex_color:
                        todas_cores[hex_color]["frequencia"] += count
                        if page_num not in todas_cores[hex_color]["paginas"]:
                            todas_cores[hex_color]["paginas"].append(page_num)
                
                paginas_processadas += 1
                sys.stdout.write("OK\n")
                sys.stdout.flush()
                
            except Exception as e:
                sys.stdout.write(f"ERRO: {str(e)}\n")
                sys.stdout.flush()
        
        # Ordenar por frequencia
        cores_sorted = sorted(todas_cores.values(), key=lambda x: x["frequencia"], reverse=True)
        
        print(f"\n[RESULTADO] {len(cores_sorted)} cores unicas encontradas")
        print(f"[PROCESSADAS] {paginas_processadas} paginas analisadas com sucesso")
        
        return {
            "total_cores_unicas": len(cores_sorted),
            "top_cores": cores_sorted[:15],
            "todas_cores": cores_sorted
        }
        
    except ImportError as e:
        print(f"\n[ERRO] pdf2image nao disponivel: {str(e)}")
        return None
    except Exception as e:
        print(f"\n[ERRO] Falha ao processar imagens: {str(e)}")
        return None

def extract_text_and_structure(pdf_path):
    """Extrai texto e estrutura do PDF"""
    
    resultado = {
        "marca": {
            "nome": "MORENA CONCEPT",
            "descricao": "Marca de moda com pilares de sustentabilidade",
        },
        "tipografia": [],
        "elementos_encontrados": [],
        "paginas_info": {}
    }
    
    try:
        print("[PDF] Lendo arquivo PDF...")
        
        with pdfplumber.open(pdf_path) as pdf:
            print(f"[INFO] Total de paginas: {len(pdf.pages)}")
            
            for page_num, page in enumerate(pdf.pages, 1):
                sys.stdout.write(f"[{page_num:02d}/{len(pdf.pages)}] Extraindo... ")
                sys.stdout.flush()
                
                page_info = {
                    "tabelas": 0,
                    "imagens": 0,
                    "texto": ""
                }
                
                # Extrair texto
                texto = page.extract_text()
                if texto:
                    page_info["texto"] = texto[:300]
                    
                    # Procurar por palavras-chave
                    texto_lower = texto.lower()
                    
                    if "fonte" in texto_lower or "typography" in texto_lower:
                        linhas = texto.split('\n')
                        for linha in linhas:
                            if 'fonte' in linha.lower() or 'font' in linha.lower():
                                if linha.strip() not in resultado["tipografia"]:
                                    resultado["tipografia"].append(linha.strip())
                    
                    if "cor" in texto_lower or "color" in texto_lower:
                        resultado["elementos_encontrados"].append(f"Pagina {page_num}: Informacoes de cores encontradas")
                
                # Contar tabelas
                tabelas = page.extract_tables()
                if tabelas:
                    page_info["tabelas"] = len(tabelas)
                
                # Contar imagens
                imagens = page.images
                if imagens:
                    page_info["imagens"] = len(imagens)
                
                resultado["paginas_info"][f"pagina_{page_num}"] = page_info
                sys.stdout.write("OK\n")
                sys.stdout.flush()
            
            print("[OK] Extracao concluida")
            
    except Exception as e:
        print(f"\n[ERRO] Falha ao ler PDF: {str(e)}")
    
    return resultado

def main():
    pdf_path = r"c:\Users\denil\Documents\BRANDBOOK - MORENA CONCEPT.pdf"
    
    print("=" * 60)
    print("[BRANDBOOK] EXTRATOR DE DADOS - MORENA CONCEPT")
    print("=" * 60)
    
    if not os.path.exists(pdf_path):
        print(f"[ERRO] Arquivo nao encontrado: {pdf_path}")
        return
    
    # Extrair informacoes gerais
    print("\n[ETAPA 1] Extraindo estrutura e texto do PDF...")
    info_estrutura = extract_text_and_structure(pdf_path)
    
    # Extrair cores das imagens
    print("\n[ETAPA 2] Analisando cores dominantes...")
    info_cores = extract_colors_from_pdf_image(pdf_path)
    
    # Montar resultado final
    resultado_final = {
        "informacoes": info_estrutura,
        "analise_cores": info_cores
    }
    
    # Salvar JSON
    output_path = r"c:\ERP MORENA CONCEPT\BRANDBOOK_MORENA_CONCEPT.json"
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(resultado_final, f, indent=2, ensure_ascii=False, default=str)
        print(f"\n[SALVO] Resultado em: {output_path}")
    except Exception as e:
        print(f"[ERRO] Falha ao salvar: {str(e)}")
    
    # Exibir resumo
    print("\n" + "=" * 60)
    print("[RESUMO] CORES DOMINANTES ENCONTRADAS")
    print("=" * 60)
    
    if info_cores and info_cores.get('top_cores'):
        for idx, cor in enumerate(info_cores['top_cores'][:12], 1):
            print(f"\n[{idx:02d}] {cor['hex'].upper()}")
            print(f"      RGB: {cor['rgb']}")
            print(f"      CMYK: {cor['cmyk']}")
            print(f"      Frequencia: {cor['frequencia']} pixels")
    
    print("\n" + "=" * 60)
    print("[FIM] Processamento concluido")
    print("=" * 60)

if __name__ == "__main__":
    main()
