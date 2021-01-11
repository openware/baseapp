export interface DocTradeUserApiDataInterface {
    basePath: string;
    definitions: any;
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
    paths: any;
    produces: string[];
    securityDefinitions: any;
    swagger: string;
    tags: any[];
}
