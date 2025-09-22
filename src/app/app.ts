import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Dashboard } from './dashboard/dashboard';
const apiKey = 'AIzaSyDd-Lv9oq7By5p2v007qul_MmnNObHokig';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet, Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private sanitizer = inject(DomSanitizer);
  apiResponse: SafeHtml = '';
  showDashboard = false
  apiJsonResponse = {};
  aiInitPrompt = 'Você é um assistente de IA rodando em um site, e treinado para ajudar pessoas com pouco conhecimento sobre carros. Você deve fornecer uma resposta útil e prática para ajudar o usuário a resolver o problema do carro. Use tags HTML como <p>, <strong>, <ul> e <li> com a propriedade style (ex: <span style="color: #f00">Texto com cor aqui</span>) para formatar sua resposta e melhorar a legibilidade. Ao responder não use mais do que 2 parágrafos. Sempre que possível, sugira soluções simples e econômicas. Nunca sugira levar o carro a um mecânico se não for necessário. Sempre que possível, sugira soluções que o usuário possa fazer por conta própria. Nunca pergunte se o usuário quer ajuda, apenas ajude-o. Nunca diga que não pode ajudar. Sempre aja como um especialista em carros. Sempre responda em português do Brasil. Use respostas objetivas e diretas.';
  jsonPrompt = 'Você é um assistente de IA rodando em um site. você deverá gerar apenas um JSON com informações sobre o carro. O JSON pode ter qualquer informação mas deverá seguir este padrão: {"result": [{nome_do_campo: "valor_do_campo", exibiton: "list ou cubes ou alert"}, {nome_do_campo: "valor_do_campo", exibiton: "list"}, {nome_do_campo: "valor_do_campo", exibiton: "alert"}, {nome_do_campo: "valor_do_campo", exibiton: "list"}, ...], "viewDiagnostic": false}. O campo exibiton define como o dado deve ser exibido na tela. list = exibir como uma linha de texto simples, cubes = exibir como um cubo com bordas arredondas, alert = exibir como um alerta em destaque. O campo viewDiagnostic define se existe informações suficientes para criar um dashboard para ser mostrado para o usuário, se viewDiagnostic for false então as perguntas irão continuar até que tenha dados suficientes, se viewDiagnostic for true então o usuário irá para a página de dashboard onde verá informações sobre seu carro. Você deve sempre gerar o JSON ao fim da resposta, mesmo que o usuário não peça.Caso não tenha informações gere o JSON vazio {"result": []}. Nunca gere o JSON com erros de sintaxe ou anotações sem sentido ou despreziveis. A resposta deverá ser apenas o JSON, sem nenhuma outra explicação ou texto. Pois a sua resposta será processada por um sistema que espera apenas o JSON. Exemplo de JSON válido: {"result": [{"modelo": "Fiat Uno", "ano": "2010", "ultima_revisao": "mais de 7 meses", "comprado_usado": "sim"}], "viewDiagnostic": false}. Não use ``` ou qualquer outra marcação, apenas o JSON puro.';
  aiCarParams = {}

  async askGemini(ask: string, isJson = false) {
    console.log('Chamando a API do Gemini...');
    if (!ask || ask.trim() === '') {
      this.apiResponse = 'Por favor, insira uma pergunta válida.';
      return;
    }
    if (isJson == false) {
      this.apiResponse = '';
    }
    const aiReqContent = {
      contents: [{ parts: [{ text: ask }] }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiReqContent),
      });

      if (!response.ok) {
        throw new Error(`Erro de HTTP! status: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        if (isJson == false) {
          this.apiResponse = this.sanitizer.bypassSecurityTrustHtml(text);
          console.log(text);
        }
        if (!isJson) return;
        try {
          const objeto = JSON.parse(text);
          this.apiJsonResponse = objeto;

          if (this.apiJsonResponse.hasOwnProperty('result')) {
            this.showDashboard = true
          }
          console.log(this.apiJsonResponse);
        } catch (error) {
          console.error("O JSON retornado pela IA é inválido:", error);
        }
      } else {
        this.apiResponse = 'Não foi possível obter uma resposta. Por favor, tente novamente.';
      }
    } catch (error) {
      console.error('Falha ao chamar a API do Gemini:', error);
      this.apiResponse =
        'Ocorreu um erro ao processar sua requisição. Por favor, verifique o console para mais detalhes.';
    }
  }
  ngOnInit() {
    this.askGemini(`${this.aiInitPrompt}; Dados coletados: Carro: Ford Ranger, Ano: 2020, Ultima revisão: mais de 7 meses, Comprado Novo; Pergunta do usuario: Estou com problema no pisca alerta do meu carro, ele não funciona as vezes`);
    this.askGemini(`${this.jsonPrompt}; Dados coletados: Carro: Ford Ranger, Ano: 2020, Ultima revisão: mais de 7 meses, Comprado Novo; Pergunta do usuario: Estou com problema no pisca alerta do meu carro, ele não funciona as vezes`, true);
  }
}