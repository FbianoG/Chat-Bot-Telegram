# Chat Bot Telegram

>[!NOTE]
>O projeto está programado para ler todas as mensagens recebidas e enviar para algum outro chat ou grupo de sua escolha.

## Instalação
1. Clonar repositório:
   ```bash
   git clone https://github.com/FbianoG/Chat-Bot-Telegram.git
   
2. Instalar dependências:
   ```bash
   npm install
   
3. Criar arquivo .env na root do projeto.
   
4. Configurar o arquivo .env:
   ```.env
   CHAT_SEND_ID=<ID_DO_CHAT_OU_GRUPO_QUE_IRÁ_ENVIAR_A_MENSAGEM>
   API_ID=<ID_DA_APO_DO_USUÁRIO_FORNECIDA_PELO_TELEGRAM>
   API_HASH=<HASH_DO_USUÁRIO_FORNECIDO_PELO_TELEGRAM>
   BOT_TOKEN=<TOKEN_DO_BOT_CASO_USE_BOT_PARA_ENVIO_DE_MENSAGEM>
   PORT=<NÚMERO_DA_PORTA_DO_SERVIDOR>

## Funcionamento

1. Iniciar servidor:
   
   ```bash
   npm start
![image](https://github.com/user-attachments/assets/e523ec8d-e79e-4973-8d72-1edbd37630a1)

2. Registrando os eventos:
   
     - Os eventos podem ser monitorados acessando o ```http://localhost:<SUA_PORTA_ESCOLHIDA>/```
       
>Os eventos são apagados a cada vez que o client for reiniciado!
   


 
