import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// As chaves da API e as variáveis de ambiente serão fornecidas em tempo de execução pelo Canvas
// O uso da variável __api_key_genai está documentado para referência e é essencial para o funcionamento do código
const apiKey = 'AIzaSyDd-Lv9oq7By5p2v007qul_MmnNObHokig';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  apiResponse = '';

  async askGemini(ask: string) {
    console.log('Chamando a API do Gemini...');
    this.apiResponse = '';
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
        this.apiResponse = text;
        console.log(text);
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
    this.askGemini('Olá, tudo bem?');
  }
}
