export interface DocTradeUserApiDataInterface {
    basePath: string;
    definitions: Object;
    host: string;
    info: {
        contact: {
            email: string;
            name: string;
            url: string;
        };
        description: string;
        license: {
            url: string;
        };
        title: string;
        version: string;
    };
    paths: Object;
    produces: string[];
    securityDefinitions:  Object;
    swagger: string;
    tags: Object[];
}
