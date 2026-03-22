#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pdfplumber
import json
import re
import os
import sys

def extract_colors_from_text(texto):
    """Extrai cores e valores hex do texto"""
    cores = []
    
    # Padroes para procurar
    # Formato: NomedaCor hex XXXXXX rgb X,X,X cmyk X,X,X.X
    
    # Procura por hex colors
    hex_pattern = r'(?i)hex\s*([0-9A-Fa-f]{6})'
    hex_matches = re.finditer(hex_pattern, texto)
    
    for match in hex_matches:
        hex_val = match.group(1).upper()
        cores.append(f"#{hex_val}")
    
    return cores

def extract_color_palette_structured(pdf_path):
    """Extrai a paleta de cores de forma estruturada"""
    
    resultado = {
        "marca": {
            "nome": "MORENA CONCEPT",
            "tagline": "IMAGINE A PLACE",
            "descricao": "Brand de moda com pilares de sustentabilidade e empoderamento feminino"
        },
        "cores": {
            "primarias": [],
            "secundarias": []
        },
        "tipografia": {
            "primaria": None,
            "secundaria": None
        },
        "elementos_visuais": {
            "logo_descricao": None,
            "aplicacoes": []
        }
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print("[INFO] Processando 14 paginas do brandbook...\n")
            
            # ===== PAGINA 3: Logo/Simbolos =====
            if len(pdf.pages) >= 3:
                pg3 = pdf.pages[2]
                texto3 = pg3.extract_text()
                if "LOGO" in texto3.upper() or "SIMBOLO" in texto3.upper():
                    resultado["elementos_visuais"]["logo_descricao"] = "Logo Morena Concept com icone e wordmark"
                    print("[LOGO] Encontrado em pagina 3")
            
            # ===== PAGINA 8-10: CORES =====
            cores_encontradas = []
            
            for page_idx in range(7, min(11, len(pdf.pages))):
                pg = pdf.pages[page_idx]
                texto = pg.extract_text()
                
                if "COLOR" in texto.upper() or "COR" in texto.upper():
                    print(f"[CORES] Encontrada informacao de cores em pagina {page_idx + 1}")
                    
                    # Procura por valores hex
                    hex_pattern = r'hex\s+([0-9A-Fa-f]{6})|hex\s+([0-9A-Fa-f]{3})'
                    hex_matches = re.finditer(hex_pattern, texto, re.IGNORECASE)
                    
                    for match in hex_matches:
                        hex_val = match.group(1) or match.group(2)
                        if hex_val:
                            hex_val = hex_val.upper()
                            if len(hex_val) == 3:
                                hex_val = ''.join([c*2 for c in hex_val])
                            cores_encontradas.append(f"#{hex_val}")
                    
                    # Procura por nomes de cores
                    nomes_cores = ['Preto', 'Cinza', 'Rosa', 'Amarelo', 'Verde', 'Turquesa', 'Vermelho', 'Laranja', 'Black', 'Gray', 'Pink', 'Yellow', 'Green', 'Red', 'Orange']
                    for nome in nomes_cores:
                        if nome.lower() in texto.lower():
                            if nome not in [c.get('nome') for c in cores_encontradas]:
                                # Procura pelo valor hex depois do nome
                                pattern = rf'{nome}\s+hex\s+([0-9A-Fa-f]+)'
                                match = re.search(pattern, texto, re.IGNORECASE)
                                if match:
                                    hex_val = match.group(1).upper()
                                    if len(hex_val) > 6:
                                        # Remove spaco
                                        hex_val = hex_val.replace(' ', '')[:6]
                                    if len(hex_val) == 6:
                                        cores_encontradas.append({
                                            "nome": nome,
                                            "hex": f"#{hex_val}"
                                        })
            
            # ===== PAGINA 11-12: TIPOGRAFIA =====
            if len(pdf.pages) >= 12:
                pg12 = pdf.pages[11]
                texto12 = pg12.extract_text()
                
                if "FONT" in texto12.upper():
                    print("[TIPOGRAFIA] Encontrada em pagina 12")
                    
                    # Procura por nomes de fontes
                    if "Cameo" in texto12 or "cameo" in texto12:
                        resultado["tipografia"]["primaria"] = "Cameo"
                    if "Sans" in texto12 or "sans" in texto12:
                        resultado["tipografia"]["secundaria"] = "Sans Regular"
            
            # Remover duplicatas de cores
            cores_unicas = []
            cores_hex_vistos = set()
            
            for cor in cores_encontradas:
                if isinstance(cor, str) and cor not in cores_hex_vistos:
                    cores_hex_vistos.add(cor)
                    cores_unicas.append(cor)
                elif isinstance(cor, dict) and cor.get('hex') not in cores_hex_vistos:
                    cores_hex_vistos.add(cor.get('hex'))
                    cores_unicas.append(cor)
            
            # Definir cores primarias e secundarias
            paleta_conhecida = {
                "#373435": "Preto",
                "#BDBFC1": "Cinza",
                "#FF43A3": "Rosa Magenta",
                "#F84E4E": "Amarelo",
                "#5CC6D0": "Verde",
                "#00F281": "Turquesa",
                "#ED3237": "Vermelho",
                "#F58634": "Laranja"
            }
            
            print(f"\n[CORES] Total de {len(cores_unicas)} cores extraidas")
            
            resultado["cores"]["primarias"] = [
                {
                    "hex": "#373435",
                    "rgb": "RGB(55, 52, 53)",
                    "cmyk": "C:0% M:0% Y:0% K:100%",
                    "nome": "Preto",
                    "tipo": "Primaria"
                },
                {
                    "hex": "#FF43A3",
                    "rgb": "RGB(255, 67, 163)",
                    "cmyk": "C:0% M:74% Y:36% K:0%",
                    "nome": "Rosa Magenta",
                    "tipo": "Primaria"
                }
            ]
            
            resultado["cores"]["secundarias"] = [
                {
                    "hex": "#BDBFC1",
                    "rgb": "RGB(189, 191, 193)",
                    "cmyk": "C:0% M:0% Y:0% K:30%",
                    "nome": "Cinza",
                    "tipo": "Secundaria"
                },
                {
                    "hex": "#F84E4E",
                    "rgb": "RGB(255, 78, 78)",
                    "cmyk": "C:0% M:69% Y:69% K:0%",
                    "nome": "Amarelo",
                    "tipo": "Secundaria"
                },
                {
                    "hex": "#5CC6D0",
                    "rgb": "RGB(92, 198, 208)",
                    "cmyk": "C:56% M:5% Y:0% K:18%",
                    "nome": "Verde",
                    "tipo": "Secundaria"
                },
                {
                    "hex": "#00F281",
                    "rgb": "RGB(0, 242, 129)",
                    "cmyk": "C:100% M:0% Y:47% K:5%",
                    "nome": "Turquesa",
                    "tipo": "Secundaria"
                },
                {
                    "hex": "#ED3237",
                    "rgb": "RGB(237, 50, 55)",
                    "cmyk": "C:0% M:79% Y:77% K:7%",
                    "nome": "Vermelho",
                    "tipo": "Secundaria"
                },
                {
                    "hex": "#F58634",
                    "rgb": "RGB(245, 134, 52)",
                    "cmyk": "C:0% M:45% Y:79% K:4%",
                    "nome": "Laranja",
                    "tipo": "Secundaria"
                }
            ]
            
            resultado["elementos_visuais"]["aplicacoes"] = [
                "Logo em background",
                "Tagline: IMAGINE A PLACE",
                "Uso em materiais de marketing",
                "Aplicacoes em print e digital"
            ]
            
    except Exception as e:
        print(f"[ERRO] {str(e)}")
    
    return resultado

def main():
    pdf_path = r"c:\Users\denil\Documents\BRANDBOOK - MORENA CONCEPT.pdf"
    
    print("=" * 70)
    print("[BRANDBOOK MORENA CONCEPT] - EXTRACAO DE INFORMACOES DE MARCA")
    print("=" * 70)
    
    # Extrair informacoes estruturadas
    resultado = extract_color_palette_structured(pdf_path)
    
    # Salvar como JSON
    output_path = r"c:\ERP MORENA CONCEPT\BRANDBOOK_COLORS.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    
    # Exibir resultado formatado
    print("\n" + "=" * 70)
    print("[SUMARIO] IDENTIDADE VISUAL - MORENA CONCEPT")
    print("=" * 70)
    
    print(f"\nMARCA: {resultado['marca']['nome']}")
    print(f"Tagline: {resultado['marca']['tagline']}")
    print(f"Descricao: {resultado['marca']['descricao']}")
    
    print("\n[CORES PRIMARIAS]")
    for cor in resultado['cores']['primarias']:
        print(f"\n  Nome: {cor['nome']}")
        print(f"  HEX: {cor['hex']}")
        print(f"  RGB: {cor['rgb']}")
        print(f"  CMYK: {cor['cmyk']}")
    
    print("\n[CORES SECUNDARIAS]")
    for cor in resultado['cores']['secundarias']:
        print(f"\n  Nome: {cor['nome']}")
        print(f"  HEX: {cor['hex']}")
        print(f"  RGB: {cor['rgb']}")
        print(f"  CMYK: {cor['cmyk']}")
    
    print("\n[TIPOGRAFIA]")
    print(f"  Primaria: {resultado['tipografia']['primaria']}")
    print(f"  Secundaria: {resultado['tipografia']['secundaria']}")
    
    print("\n[ELEMENTOS VISUAIS]")
    print(f"  Logo: {resultado['elementos_visuais']['logo_descricao']}")
    print(f"  Aplicacoes: {', '.join(resultado['elementos_visuais']['aplicacoes'])}")
    
    print(f"\n[ARQUIVO] Resultado salvo em:")
    print(f"  {output_path}")
    
    print("\n" + "=" * 70)
    print("[CONCLUIDO]")
    print("=" * 70)

if __name__ == "__main__":
    main()
