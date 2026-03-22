import pdfplumber
import json
import os
from PIL import Image
import colorsys
from collections import defaultdict

def extract_brandbook_info(pdf_path):
    """Extrai informações do brandbook em PDF"""
    
    result = {
        "marca": {
            "nome": None,
            "descricao_logo": None,
        },
        "cores": {
            "primarias": [],
            "secundarias": [],
            "terciarias": [],
            "paleta_completa": []
        },
        "tipografia": {
            "fontes_principais": [],
            "fontes_recomendadas": []
        },
        "elementos_visuais": {
            "padroes": [],
            "elementos_decorativos": [],
            "componentes": []
        },
        "imagens_extraidas": []
    }
    
    if not os.path.exists(pdf_path):
        print(f"Erro: Arquivo não encontrado em {pdf_path}")
        return result
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"\n📄 Total de páginas: {len(pdf.pages)}\n")
            
            # Extrair texto de todas as páginas
            full_text = ""
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"📄 Processando página {page_num}...")
                
                # Extrair texto
                text = page.extract_text()
                if text:
                    full_text += f"\n--- PÁGINA {page_num} ---\n{text}"
                
                # Extrair cores do conteúdo
                if page.chars:
                    cores_encontradas = extrair_cores_da_pagina(page)
                    if cores_encontradas:
                        for cor in cores_encontradas:
                            if cor not in result["cores"]["paleta_completa"]:
                                result["cores"]["paleta_completa"].append(cor)
                
                # Extrair imagens
                try:
                    images = page.images
                    if images:
                        print(f"   ✓ Encontradas {len(images)} imagem(ns)")
                        for img_idx, img in enumerate(images):
                            result["imagens_extraidas"].append({
                                "pagina": page_num,
                                "indice": img_idx,
                                "bbox": img.get("bbox")
                            })
                except:
                    pass
                
                # Extrair tabelas
                tables = page.extract_tables()
                if tables:
                    print(f"   ✓ Encontradas {len(tables)} tabela(s)")
            
            # Processar texto extraído
            processar_texto_brandbook(full_text, result)
            
            print(f"\n✓ PDF processado com sucesso!")
            
    except Exception as e:
        print(f"❌ Erro ao processar PDF: {e}")
    
    return result

def processar_texto_brandbook(texto, result):
    """Processa o texto extraído para identificar informações do brandbook"""
    
    texto_lower = texto.lower()
    
    # Procurar por palavras-chave relacionadas a cores
    linhas = texto.split('\n')
    
    for linha in linhas:
        linha_lower = linha.lower()
        
        # Procurar informações sobre cores
        if any(word in linha_lower for word in ['cor', 'color', 'hex', 'rgb', 'cmyk', 'pantone', 'primária', 'primary', 'secundária', 'secondary']):
            # Tentar extrair valores hex
            hex_values = extrair_hex_da_linha(linha)
            for hex_val in hex_values:
                cor_info = {
                    "hex": hex_val,
                    "rgb": hex_to_rgb(hex_val),
                    "descricao": linha.strip()
                }
                if cor_info not in result["cores"]["paleta_completa"]:
                    result["cores"]["paleta_completa"].append(cor_info)
        
        # Procurar informações sobre tipografia
        if any(word in linha_lower for word in ['font', 'fonte', 'tipografia', 'typography', 'typeface']):
            if linha.strip() not in result["tipografia"]["fontes_recomendadas"]:
                result["tipografia"]["fontes_recomendadas"].append(linha.strip())
        
        # Procurar informações sobre marca/logo
        if any(word in linha_lower for word in ['logo', 'marca', 'brand', 'identidade']):
            if not result["marca"]["nome"] and len(linha.strip()) < 100:
                result["marca"]["nome"] = linha.strip()
            if not result["marca"]["descricao_logo"] and len(linha.strip()) > 10:
                result["marca"]["descricao_logo"] = linha.strip()

def extrair_hex_da_linha(linha):
    """Extrai valores hex de uma linha de texto"""
    import re
    # Procura por padrões hex (#RRGGBB ou #RGB)
    hex_pattern = r'#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}'
    matches = re.findall(hex_pattern, linha)
    return matches

def extrair_cores_da_pagina(page):
    """Extrai cores dominantes da página usando caracteres"""
    cores = {}
    try:
        if hasattr(page, 'chars') and page.chars:
            for char in page.chars:
                if 'color' in char or 'fill' in char:
                    cor = char.get('color') or char.get('fill')
                    if cor:
                        cores[str(cor)] = cores.get(str(cor), 0) + 1
    except:
        pass
    
    # Retornar cores mais frequentes
    top_cores = sorted(cores.items(), key=lambda x: x[1], reverse=True)[:5]
    return [cor[0] for cor in top_cores]

def hex_to_rgb(hex_color):
    """Converte cor hex para RGB"""
    try:
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except:
        return None

def rgb_to_hex(rgb):
    """Converte RGB para hex"""
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
        return {
            "c": int(c * 100),
            "m": int(m * 100),
            "y": int(y * 100),
            "k": int(k * 100)
        }
    except:
        return None

if __name__ == "__main__":
    pdf_path = r"c:\Users\denil\Documents\BRANDBOOK - MORENA CONCEPT.pdf"
    
    print("🎨 Extrator de Brandbook PDF")
    print("=" * 50)
    
    resultado = extract_brandbook_info(pdf_path)
    
    # Melhorar formatação das cores
    resultado_formatado = resultado.copy()
    
    # Converter resultado para JSON
    resultado_json = json.dumps(resultado_formatado, indent=2, ensure_ascii=False)
    
    # Salvar em arquivo
    output_path = r"c:\ERP MORENA CONCEPT\brandbook_extracted.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(resultado_json)
    
    print(f"\n✓ Resultado salvo em: {output_path}")
    print("\n" + "=" * 50)
    print("📊 Resumo do Brandbook:")
    print(f"Cores encontradas: {len(resultado['cores']['paleta_completa'])}")
    print(f"Fontes recomendadas: {len(resultado['tipografia']['fontes_recomendadas'])}")
    print(f"Imagens extraídas: {len(resultado['imagens_extraidas'])}")
    
    # Exibir resultado
    print("\n" + json.dumps(resultado_formatado, indent=2, ensure_ascii=False))
