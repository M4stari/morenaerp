#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

def gerar_sumario_brandbook():
    """Gera sumario completo do brandbook MORENA CONCEPT com todas as cores extraidas"""
    
    resultado = {
        "brandbook": {
            "nome": "MORENA CONCEPT",
            "tipo": "Brandbook - Identidade Visual",
            "versao": "1.0",
            "data": "2026",
            "total_paginas": 14,
            "descricao": "Guia completo da identidade visual da marca MORENA CONCEPT - Brand de moda sustentavel"
        },
        "marca": {
            "nome_principal": "MORENA CONCEPT",
            "tagline": "IMAGINE A PLACE",
            "conceito": "Marca de moda com pilares de sustentabilidade e empoderamento do publico feminino",
            "logo": {
                "descricao": "Logo Morena Concept com icone e wordmark",
                "elementos": ["Icone", "Wordmark", "Tagline"],
                "variantes": ["Logo completa", "Logo reduzida", "Logo vertical", "Logo horizontal"]
            }
        },
        "paleta_de_cores": {
            "cores_primarias": [
                {
                    "posicao": 1,
                    "nome": "Preto",
                    "hex": "#373435",
                    "rgb": "RGB(55, 52, 53)",
                    "cmyk": "C:0% M:0% Y:0% K:100%",
                    "descricao": "Cor primaria - Representa forca e elegancia",
                    "uso": "Tipografia, elementos principais, fundo"
                },
                {
                    "posicao": 2,
                    "nome": "Rosa Magenta",
                    "hex": "#FF43A3",
                    "rgb": "RGB(255, 67, 163)",
                    "cmyk": "C:0% M:74% Y:36% K:0%",
                    "descricao": "Cor primaria - Representa feminilidade e destaque",
                    "uso": "Acentos, destaque visual, elementos principais"
                }
            ],
            "cores_secundarias": [
                {
                    "posicao": 3,
                    "nome": "Cinza",
                    "hex": "#BDBFC1",
                    "rgb": "RGB(189, 191, 193)",
                    "cmyk": "C:0% M:0% Y:0% K:30%",
                    "descricao": "Cor secundaria - Representa neutralidade",
                    "uso": "Fundos, separadores, elementos neutros"
                },
                {
                    "posicao": 4,
                    "nome": "Amarelo",
                    "hex": "#F84E4E",
                    "rgb": "RGB(255, 78, 78)",
                    "cmyk": "C:0% M:69% Y:69% K:0%",
                    "descricao": "Cor secundaria - Representa energia e criatividade",
                    "uso": "Destaque, chamadas de atencao, acentos"
                },
                {
                    "posicao": 5,
                    "nome": "Verde",
                    "hex": "#5CC6D0",
                    "rgb": "RGB(92, 198, 208)",
                    "cmyk": "C:56% M:5% Y:0% K:18%",
                    "descricao": "Cor secundaria - Representa sustentabilidade e crescimento",
                    "uso": "Elementos relacionados a sustentabilidade"
                },
                {
                    "posicao": 6,
                    "nome": "Turquesa",
                    "hex": "#00F281",
                    "rgb": "RGB(0, 242, 129)",
                    "cmyk": "C:100% M:0% Y:47% K:5%",
                    "descricao": "Cor secundaria - Representa frescor e inovacao",
                    "uso": "Elementos modernos, acentos vibrantes"
                },
                {
                    "posicao": 7,
                    "nome": "Vermelho",
                    "hex": "#ED3237",
                    "rgb": "RGB(237, 50, 55)",
                    "cmyk": "C:0% M:79% Y:77% K:7%",
                    "descricao": "Cor secundaria - Representa paixao e energia",
                    "uso": "Acentos fortes, chamadas de atencao"
                },
                {
                    "posicao": 8,
                    "nome": "Laranja",
                    "hex": "#F58634",
                    "rgb": "RGB(245, 134, 52)",
                    "cmyk": "C:0% M:45% Y:79% K:4%",
                    "descricao": "Cor secundaria - Representa entusiasmo e carisma",
                    "uso": "Acentos quentes, elementos dinamicos"
                }
            ],
            "combinacoes_recomendadas": [
                {
                    "pareamento": "Preto + Rosa Magenta",
                    "contexto": "Elementos principais, logotipo, destaques"
                },
                {
                    "pareamento": "Cinza + Preto",
                    "contexto": "Layous neutros, tipografia, fundos"
                },
                {
                    "pareamento": "Rosa Magenta + Amarelo",
                    "contexto": "Elementos juvenis, dinamicos"
                },
                {
                    "pareamento": "Verde + Turquesa",
                    "contexto": "Mensagens de sustentabilidade"
                }
            ]
        },
        "tipografia": {
            "fonte_primaria": {
                "nome": "Cameo",
                "peso": "Regular, Bold, Black",
                "uso": "Titulos, destaques, logotipo",
                "descricao": "Fonte moderna e elegante"
            },
            "fonte_secundaria": {
                "nome": "Sans Regular",
                "peso": "Regular, SemiBold",
                "uso": "Corpo de texto, descricoes, conteudo",
                "descricao": "Fonte limpa e legivel"
            }
        },
        "eleulos_visuais": {
            "logo": {
                "tipo": "Primaria com icone e wordmark",
                "variantes": [
                    "Logo completa (horizontal)",
                    "Logo completa (vertical)",
                    "Logo reduzida",
                    "Icone isolado"
                ],
                "criterios_minimos": "Tamanho minimo de 40px para web, 10mm para print"
            },
            "slogan": {
                "texto_principal": "IMAGINE A PLACE",
                "posicionamento": "Centro do layout quando usado com logo",
                "tipografia": "Cameo ou Sans Regular"
            },
            "padroes": [
                {
                    "nome": "Padroes florais",
                    "descricao": "Padroes decorativos com elementos naturais",
                    "cor": "Combinacoes de cores secundarias"
                },
                {
                    "nome": "Elementos geometricos",
                    "descricao": "Linhas e formas minimalistas",
                    "cor": "Preto, Cinza, Rosa Magenta"
                }
            ],
            "elementos_decorativos": [
                "Linhas decorativas em preto",
                "Elementos florais em rosa magenta",
                "Blocos de cor em tonalidades da paleta",
                "Efeitos de transparencia"
            ]
        },
        "aplicacoes": {
            "print": [
                "Cartoes de visita",
                "Papelaria corporativa",
                "Embalagens de produtos",
                "Catalagos e brochuras",
                "Materiais promocionais"
            ],
            "digital": [
                "Website",
                "Redes sociais",
                "Publicidade digital",
                "Aplicativos mobile",
                "Email marketing"
            ],
            "vestuario": [
                "Etiquetas de roupas",
                "Hangtags",
                "Logos em pecas de vestuario",
                "Acessorios"
            ]
        },
        "espacamento_e_margens": {
            "logo": {
                "area_minima_respiro": "Altura do logo (x) em todos os lados",
                "distancia_minima": "1x (sendo x a altura da marca)"
            }
        },
        "resumo_visual": {
            "total_cores": 8,
            "cores_primarias_count": 2,
            "cores_secundarias_count": 6,
            "fontes_principais": 2,
            "elementos_graficos": "Logos, padroes, elementos decorativos"
        }
    }
    
    return resultado

def main():
    print("=" * 80)
    print("[BRANDBOOK MORENA CONCEPT] - GERACAO DE SUMARIO ESTRUTURADO")
    print("=" * 80)
    
    # Gerar resultado
    sumario = gerar_sumario_brandbook()
    
    # Salvar como JSON
    output_path = r"c:\ERP MORENA CONCEPT\BRANDBOOK_MORENA_CONCEPT_COMPLETO.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sumario, f, indent=2, ensure_ascii=False)
    
    print("\n[INFORMACOES EXTRAIDAS]")
    print(f"\nMARCA: {sumario['marca']['nome_principal']}")
    print(f"Tagline: {sumario['marca']['tagline']}")
    print(f"Descricao: {sumario['marca']['conceito']}")
    
    print(f"\n[PALETA DE CORES]")
    print(f"\nCores Primarias:")
    for cor in sumario['paleta_de_cores']['cores_primarias']:
        print(f"\n  {cor['nome'].upper()}")
        print(f"    HEX: {cor['hex']}")
        print(f"    RGB: {cor['rgb']}")
        print(f"    CMYK: {cor['cmyk']}")
        print(f"    Uso: {cor['uso']}")
    
    print(f"\n\nCores Secundarias:")
    for cor in sumario['paleta_de_cores']['cores_secundarias']:
        print(f"\n  {cor['nome'].upper()}")
        print(f"    HEX: {cor['hex']}")
        print(f"    RGB: {cor['rgb']}")
        print(f"    CMYK: {cor['cmyk']}")
        print(f"    Uso: {cor['uso']}")
    
    print(f"\n\n[TIPOGRAFIA]")
    print(f"\nFonte Primaria: {sumario['tipografia']['fonte_primaria']['nome']}")
    print(f"  Uso: {sumario['tipografia']['fonte_primaria']['uso']}")
    print(f"\nFonte Secundaria: {sumario['tipografia']['fonte_secundaria']['nome']}")
    print(f"  Uso: {sumario['tipografia']['fonte_secundaria']['uso']}")
    
    print(f"\n\n[ELEMENTOS VISUAIS]")
    print(f"Logo: {sumario['eleulos_visuais']['logo']['tipo']}")
    print(f"Variantes: {', '.join(sumario['eleulos_visuais']['logo']['variantes'])}")
    print(f"Slogan: {sumario['eleulos_visuais']['slogan']['texto_principal']}")
    
    print(f"\n\n[RESUMO]")
    print(f"Total de cores: {sumario['resumo_visual']['total_cores']}")
    print(f"Cores primarias: {sumario['resumo_visual']['cores_primarias_count']}")
    print(f"Cores secundarias: {sumario['resumo_visual']['cores_secundarias_count']}")
    print(f"Fontes principais: {sumario['resumo_visual']['fontes_principais']}")
    
    print(f"\n[ARQUIVO SALVO]")
    print(f"Localizacao: {output_path}")
    
    print("\n" + "=" * 80)
    print("[PROCESSAMENTO CONCLUIDO COM SUCESSO]")
    print("=" * 80)

if __name__ == "__main__":
    main()
