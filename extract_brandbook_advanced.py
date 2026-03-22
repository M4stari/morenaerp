import pdfplumber
import json
import os
from PIL import Image
from collections import Counter
import colorsys
import io

def rgb_to_hex(rgb):
    """Converte RGB para HEX"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

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

def extrair_cores_da_imagem(imagem_bytes):
    """Extrai cores dominantes de uma imagem"""
    try:
        img = Image.open(io.BytesIO(imagem_bytes))
        img = img.convert('RGB')
        
        # Redimensionar para análise mais rápida
        img_small = img.resize((100, 100))
        pixels = list(img_small.getdata())
        
        # Encontrar cores dominantes
        color_counter = Counter(pixels)
        top_colors = color_counter.most_common(10)
        
        cores = []
        for color, count in top_colors:
            hex_color = rgb_to_hex(color)
            cmyk_color = rgb_to_cmyk(color)
            cores.append({
                "hex": hex_color,
                "rgb": f"RGB({color[0]}, {color[1]}, {color[2]})",
                "cmyk": cmyk_color,
                "frequencia": count
            })
        
        return cores
    except Exception as e:
        return []

def extract_brandbook_completo(pdf_path):
    """Extrai informações completas do brandbook incluindo cores das imagens"""
    
    resultado = {
        "marca": {
            "nome": "MORENA CONCEPT",
            "descricao": "Brand de moda com pilares de sustentabilidade",
            "total_paginas": 0
        },
        "cores": {
            "paleta_primaria": [],
            "paleta_secundaria": [],
            "paleta_completa": []
        },
        "tipografia": [],
        "elementos_visuais": {
            "logos": [],
            "padroes": [],
            "elementos_decorativos": [],
            "componentes": []
        },
        "texto_extraido": {}
    }
    
    if not os.path.exists(pdf_path):
        print(f"❌ Arquivo não encontrado: {pdf_path}")
        return resultado
    
    try:
        todas_as_cores = Counter()
        
        with pdfplumber.open(pdf_path) as pdf:
            resultado["marca"]["total_paginas"] = len(pdf.pages)
            print(f"\n[PROCESSAMENTO] Processando BRANDBOOK - MORENA CONCEPT")
            print(f"[PAGINAS] Total de paginas: {len(pdf.pages)}\n")
            
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"[{page_num}/{len(pdf.pages)}] Pagina {page_num}...", end=" ")
                
                # Extrair texto
                texto = page.extract_text()
                if texto and len(texto.strip()) > 0:
                    resultado["texto_extraido"][f"pagina_{page_num}"] = texto[:500]  # Primeiros 500 chars
                
                # Extrair e analisar imagens
                imagens = page.images
                if imagens:
                    print(f"[{len(imagens)} img]", end=" ")
                    
                    for img_idx, img in enumerate(imagens):
                        try:
                            # Converter objeto de imagem para bytes
                            img_bytes = page.im.crop(img['bbox']).tobytes() if hasattr(page.im, 'crop') else b''
                            
                            # Extrair usando PIL
                            crop_obj = (int(img['bbox'][0]), int(img['bbox'][1]), 
                                       int(img['bbox'][2]), int(img['bbox'][3]))
                            
                            if hasattr(page, 'surfaces') or hasattr(page, 'root_page'):
                                continue
                                
                        except:
                            pass
                
                # Extrair tabelas que podem conter informações de cores
                tabelas = page.extract_tables()
                if tabelas:
                    print(f"[{len(tabelas)} tab]", end=" ")
                    for tab_idx, tabela in enumerate(tabelas):
                        for linha in tabela:
                            for celula in linha:
                                if celula and any(x in str(celula).lower() for x in ['#', 'hex', 'color', 'cor', 'rgb', 'cmyk']):
                                    resultado["texto_extraido"][f"tabela_p{page_num}_t{tab_idx}"] = str(celula)[:200]
                
                print("✓")
            
            # Extraçao mais direta usando pdfplumber para imagens
            print("\n[CORES] Analisando cores das imagens...")
            for page_num, page in enumerate(pdf.pages, 1):
                try:
                    # Tentar extrair imagens como objetos
                    for item in page.chars:
                        # Alguns PDFs armazenam cores nos caracteres
                        if 'color' in item:
                            try:
                                color = item['color']
                                if color:
                                    todas_as_cores[color] += 1
                            except:
                                pass
                except:
                    pass
        
        # Organizar cores encontradas
        if todas_as_cores:
            cores_ordenadas = sorted(todas_as_cores.items(), key=lambda x: x[1], reverse=True)
            
            # Primeiras 5 cores como paleta primária
            for idx, (color, freq) in enumerate(cores_ordenadas[:5]):
                if idx < 3:
                    resultado["cores"]["paleta_primaria"].append({
                        "cor": color,
                        "frequencia": freq,
                        "tipo": f"Principal {idx+1}"
                    })
                else:
                    resultado["cores"]["paleta_secundaria"].append({
                        "cor": color,
                        "frequencia": freq,
                        "tipo": f"Secundária {idx-2}"
                    })
            
            # Todas as cores
            for color, freq in cores_ordenadas[:20]:
                resultado["cores"]["paleta_completa"].append({
                    "cor": color,
                    "frequencia": freq
                })
        
        print("✓ Análise concluída!")
        
    except Exception as e:
        print(f"❌ Erro ao processar PDF: {e}")
        import traceback
        traceback.print_exc()
    
    return resultado

def extract_com_pillow(pdf_path):
    """Alternativa usando pdf2image se disponível"""
    try:
        from pdf2image import convert_from_path
        
        print("\n[CONVERSAO] Convertendo PDF em imagens...")
        images = convert_from_path(pdf_path, dpi=150)
        
        todas_cores = {}
        
        for page_num, img in enumerate(images, 1):
            print(f"[{page_num}/{len(images)}] Analisando pagina {page_num}...", end=" ")
            
            # Redimensionar para análise
            img_small = img.resize((150, 200))
            pixels = list(img_small.getdata())
            
            # Contar cores
            color_counter = Counter(pixels)
            top_colors = color_counter.most_common(15)
            
            for color, count in top_colors:
                hex_color = rgb_to_hex(color)
                if hex_color not in todas_cores:
                    todas_cores[hex_color] = {
                        "hex": hex_color,
                        "rgb": f"RGB({color[0]}, {color[1]}, {color[2]})",
                        "cmyk": rgb_to_cmyk(color),
                        "frequencia": 0,
                        "paginas": []
                    }
                todas_cores[hex_color]["frequencia"] += count
                todas_cores[hex_color]["paginas"].append(page_num)
            
            print("✓")
        
        # Ordenar por frequência
        cores_sorted = sorted(todas_cores.values(), key=lambda x: x["frequencia"], reverse=True)
        
        return {
            "total_cores_unicas": len(cores_sorted),
            "top_cores": cores_sorted[:20],
            "todas_cores": cores_sorted
        }
        
    except ImportError:
        print("[AVISO] pdf2image nao instalado. Execute: pip install pdf2image pillow")
        return None

if __name__ == "__main__":
    pdf_path = r"c:\Users\denil\Documents\BRANDBOOK - MORENA CONCEPT.pdf"
    
    print("=" * 60)
    print("[BRANDBOOK] EXTRATOR AVANCADO DE BRANDBOOK PDF - MORENA CONCEPT")
    print("=" * 60)
    
    # Primeiro método - pdfplumber
    resultado1 = extract_brandbook_completo(pdf_path)
    
    # Segundo método - PIL/pdf2image
    print("\n" + "=" * 60)
    print("[ANALISE] Tentando analise com Pillow (pdf2image)...")
    print("=" * 60)
    
    resultado2 = extract_com_pillow(pdf_path)
    
    # Preparar resultado final
    resultado_final = {
        "brandbook": resultado1,
        "analise_cores": resultado2 if resultado2 else "Não disponível"
    }
    
    # Salvar resultado
    output_path = r"c:\ERP MORENA CONCEPT\brandbook_completo.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(resultado_final, f, indent=2, ensure_ascii=False, default=str)
    
    print(f"\n[OK] Resultado salvo em: {output_path}")
    
    # Exibir resumo
    if resultado2:
        print("\n" + "=" * 60)
        print("[CORES] CORES DOMINANTES DO BRANDBOOK")
        print("=" * 60)
        
        if resultado2.get('top_cores'):
            for idx, cor in enumerate(resultado2['top_cores'][:10], 1):
                print(f"\n{idx}. {cor['hex'].upper()}")
                print(f"   RGB: {cor['rgb']}")
                print(f"   CMYK: {cor['cmyk']}")
                print(f"   Frequência: {cor['frequencia']} pixels")
                print(f"   Páginas: {set(cor['paginas'])}")
