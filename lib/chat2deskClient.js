const HttpClient = require('./httpClient');

const BaseUrl = `https://api.chat2desk.com/v1`;
const ClientsBaseUrl = `${BaseUrl}/clients`;
const DialogsBaseUrl = `${BaseUrl}/dialogs`;
const ChannelsBaseUrl = `${BaseUrl}/channels`;
const MessagesBaseUrl = `${BaseUrl}/messages`;
const OperatorsBaseUrl = `${BaseUrl}/operators`;
const MessageInboundUrl = `${BaseUrl}/messages/inbox`;

const AuthErrorMessage = 'You need to auth';
const ApiRequestExceededMessage = 'Number of API requests exceeded';
const ApiCallsExeededMessage = 'API calls exceeded API limit per month';
const TokenError = 'You have to specify your token. See API manual on info@chat2desk.com';
const PageNotFoundError = 'Page not found';

const checkResponse = (response) => {
    let responseString = '';
    if (typeof (response) == 'object') responseString = JSON.stringify(response);
    else responseString = response.toString();
    if (responseString.indexOf(TokenError) != -1) throw new Error(TokenError);
    if (responseString.indexOf(AuthErrorMessage) != -1) throw new Error(AuthErrorMessage);
    if (responseString.indexOf(ApiRequestExceededMessage) != -1) throw new Error(ApiRequestExceededMessage);
    if (responseString.indexOf(ApiCallsExeededMessage) != -1) throw new Error(ApiCallsExeededMessage);
    if (responseString.indexOf(PageNotFoundError) != -1) throw new Error(PageNotFoundError);
    return response;
}

class Chat2DeskClient {

    constructor(token) {
        if (!token) throw new Error(`Ошибка передан пустой параметр token`);
        this.token = token;
        this.httpClient = new HttpClient(token);
    }

    async InboxMessage(phone, body, chanelId) {
        try {
            if (!phone) throw new Error(`Ошибка передан пустой параметр phone`);
            if (!body) throw new Error(`Ошибка передан пустой параметр body`);
            if (!chanelId) throw new Error(`Ошибка передан пустой параметр chanelId`);            

            let url = MessageInboundUrl;
            let data = {
                channel_id: chanelId,
                body: body,
                from_client: { phone: phone }
            };

            let response = await this.httpClient.Post(url, data);
            return checkResponse(response);
        } catch (e) {
            throw new Error(`Ошибка в методе InboxMessage : ${e.toString()}`);   
        }
    }

    async GetWebHook() {
        try {
            let url = `${BaseUrl}/webhooks`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetWebHook : ${e.toString()}`);  
        }
    }

    async DeleteWebHook(id) {
        try {
             if (!id) throw new Error(`Ошибка передан пустой параметр id`);
            let url = `${BaseUrl}/webhooks/${id}`;
            let response = await this.httpClient.Delete(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе DeleteWebHook : ${e.toString()}`); 
        }
    }

    async WebHook(uri = null, name = null, events = null) {
        try {
            let url = `${BaseUrl}/webhooks`;
            let data = { url: null };
            if (uri) data = { url: uri };
            if (name) data.name = name;
            if (events) data.events = events;
            let response = await this.httpClient.Post(url, data);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе WebHook : ${e.toString()}`);
        }
    }

    async GetMessage(id) {
        try {
            if (!id) throw new Error(`Ошибка передан пустой параметр id`);
            let url = `${MessagesBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetMessage : ${e.toString()}`);
        }
    }

    async GetMessages(offset = 0, limit = 20) {
        try {
            let url = `${MessagesBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetMessages : ${e.toString()}`);
        }
    }

    async GetMessagesByDialog(dialogId, offset = 0, limit = 20) {
        try {
            let url = `${MessagesBaseUrl}?dialog_id=${dialogId}&offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetMessagesByDialog : ${e.toString()}`);
        }
    }

    async SendMessage(client_id, text = '', transport = 'whatsapp', channel_id = 0, operator_id = 0, attachment = '', pdf = '', open_dialog = false) {
        try {
            if (!client_id) throw new Error(`Ошибка передан пустой параметр client_id`);
            let url = `${MessagesBaseUrl}`;

            let data = {
                client_id: client_id, text: text,
                transport: transport, open_dialog: open_dialog
            };

            if (attachment) data.attachment = attachment;
            if (pdf) data.pdf = pdf;
            data.type = 'to_client';
            if (channel_id) data.channel_id = channel_id;
            if (operator_id) data.operator_id = operator_id;

            let response = await this.httpClient.Post(url, data);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе SendMessage : ${e.toString()}`);
        }
    }

    async GetChannels(phone = '', offset = 0, limit = 20) {
        try {
            let url = '';
            if (phone) url = `${ChannelsBaseUrl}?phone=${phone}&offset=${offset}&limit=${limit}`;
            else url = `${ChannelsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetChannels : ${e.toString()}`);
        }
    }

    async GetClient(id) {
        try {
            if (!id) throw new Error(`Ошибка передан пустой параметр id`);
            let url = `${ClientsBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetClient : ${e.toString()}`);
        }
    }

    async GetClientByPhone(phone) {
        try {
            if (!phone) throw new Error(`Ошибка передан пустой параметр phone`);
            let url = `${ClientsBaseUrl}?phone=${phone}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetClientByPhone : ${e.toString()}`);
        }
    }

    async GetClients(offset = 0, limit = 20) {
        try {
            let url = `${ClientsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetClients : ${e.toString()}`);
        }
    }

    async UpdateClient(id, data = {}) {
        try {
            if (!id) throw new Error(`Ошибка передан пустой параметр id`);
            let url = `${ClientsBaseUrl}/${id}`;
            let response = await this.httpClient.Put(url, data);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе UpdateClient : ${e.toString()}`);
        }
    }

    async CreateClient(phone, transport = 'whatsapp', channel_id = 0, nickname = "") {
        try {
            if (!phone) throw new Error(`Ошибка передан пустой параметр phone`);

            let data = { phone, transport };
            if (channel_id) data.channel_id = channel_id;
            if (nickname) data.nickname = channel_id;

            let url = `${ClientsBaseUrl}`;
            let response = await this.httpClient.Post(url, data);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе CreateClient : ${e.toString()}`);
        }
    }

    async GetDialog(id) {
        try {
            if (!id) throw new Error(`Ошибка передан пустой параметр id`);
            let url = `${DialogsBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetDialog : ${e.toString()}`);
        }
    }

    async GetDialogs(offset = 0, limit = 20) {
        try {
            let url = `${DialogsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetDialogs : ${e.toString()}`);
        }
    }

    async GetOperators(offset = 0, limit = 20) {
        try {
            let url = `${OperatorsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            return checkResponse(response);
        }
        catch (e) {
            throw new Error(`Ошибка в методе GetOperators : ${e.toString()}`);
        }
    }

}

module.exports = Chat2DeskClient;