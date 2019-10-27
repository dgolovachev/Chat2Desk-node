const HttpClient = require('./httpClient');

const BaseUrl = `https://api.chat2desk.com/v1`;
const ClientsBaseUrl = `${BaseUrl}/clients`;
const DialogsBaseUrl = `${BaseUrl}/dialogs`;
const ChannelsBaseUrl = `${BaseUrl}/channels`;
const MessagesBaseUrl = `${BaseUrl}/messages`;
const OperatorsBaseUrl = `${BaseUrl}/operators`;

const AuthErrorMessage = 'You need to auth';
const ApiRequestExceededMessage = 'Number of API requests exceeded';
const ApiCallsExeededMessage = 'API calls exceeded API limit per month';
const TokenError = 'You have to specify your token. See API manual on info@chat2desk.com';
const PageNotFoundError = 'Page not found';

const checkResponse = (response) => {
    let responseString = '';
    if (typeof (response) == 'object') responseString = JSON.stringify(response);
    else responseString = response.toString();
    if (responseString.indexOf(TokenError) != -1) throw TokenError;
    if (responseString.indexOf(AuthErrorMessage) != -1) throw AuthErrorMessage;
    if (responseString.indexOf(ApiRequestExceededMessage) != -1) throw ApiRequestExceededMessage;
    if (responseString.indexOf(ApiCallsExeededMessage) != -1) throw ApiCallsExeededMessage;
    if (responseString.indexOf(PageNotFoundError) != -1) throw PageNotFoundError;
}

class Chat2DeskClient {

    constructor(token) {
        if (!token) throw 'Chat2DeskClient token is undefined';
        this.token = token;
        this.httpClient = new HttpClient(token);
    }

    async WebHook(uri = null, name = null, events = null) {
        try {
            let url = `${BaseUrl}/companies/web_hook`;
            let data = { url: null };
            if (uri) data = { url: uri };
            if (name) data.name = name;
            if (events) data.events = events;
            let response = await this.httpClient.Post(url, data);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error WebHook: ${e.toString()}`
        }
    }

    async GetMessage(id) {
        try {
            if (!id) throw 'id is undefined';
            let url = `${MessagesBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetMessage: ${e.toString()}`
        }
    }

    async GetMessages(offset = 0, limit = 20) {
        try {
            let url = `${MessagesBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetMessages: ${e.toString()}`
        }
    }

    async GetMessagesByDialog(dialogId, offset = 0, limit = 20) {
        try {
            let url = `${MessagesBaseUrl}?dialog_id=${dialogId}&offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetMessagesByDialog: ${e.toString()}`
        }
    }

    async SendMessage(client_id, text = '', transport = 'whatsapp', channel_id = 0, operator_id = 0, attachment = '', pdf = '', open_dialog = false) {
        try {
            if (!client_id) throw 'client_id is undefined';
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
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error SendMessage: ${e.toString()}`
        }
    }

    async GetChannels(phone = '', offset = 0, limit = 20) {
        try {
            let url = '';
            if (phone) url = `${ChannelsBaseUrl}?phone=${phone}&offset=${offset}&limit=${limit}`;
            else url = `${ChannelsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetChannels: ${e.toString()}`
        }
    }

    async GetClient(id) {
        try {
            if (!id) throw 'id is undefined';
            let url = `${ClientsBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetMessage: ${e.toString()}`
        }
    }

    async GetClientByPhone(phone) {
        try {
            if (!phone) throw 'phone is undefined';
            let url = `${ClientsBaseUrl}?phone=${phone}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetMessage: ${e.toString()}`
        }
    }

    async GetClients(offset = 0, limit = 20) {
        try {
            let url = `${ClientsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetClients: ${e.toString()}`
        }
    }

    async UpdateClient(id, data = {}) {
        try {
            if (!id) throw 'id is undefined';
            let url = `${ClientsBaseUrl}/${id}`;
            let response = await this.httpClient.Put(url, data);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error UpdateClient: ${e.toString()}`
        }
    }

    async CreateClient(phone, transport = 'whatsapp', channel_id = 0, nickname = "") {
        try {
            if (!phone) throw 'phone is undefined';

            let data = { phone: phone, transport: transport };
            if (channel_id) data.channel_id = channel_id;
            if (nickname) data.nickname = channel_id;
            
            let url = `${ClientsBaseUrl}`;
            let response = await this.httpClient.Post(url, data);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error UpdateClient: ${e.toString()}`
        }
    }

    async GetDialog(id) {
        try {
            if (!id) throw 'id is undefined';
            let url = `${DialogsBaseUrl}/${id}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetDialog: ${e.toString()}`
        }
    }

    async GetDialogs(offset = 0, limit = 20) {
        try {
            let url = `${DialogsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetDialogs: ${e.toString()}`
        }
    }

    async GetOperators(offset = 0, limit = 20) {
        try {
            let url = `${OperatorsBaseUrl}?offset=${offset}&limit=${limit}`;
            let response = await this.httpClient.Get(url);
            checkResponse(response);
            return response;
        }
        catch (e) {
            throw `Error GetOperators: ${e.toString()}`
        }
    }

}

module.exports = Chat2DeskClient;