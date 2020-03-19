export class Post {



    constructor(
                public TITLE?: string,
                public CATEGORY?: string,
                public SUBCATEGORY?: string,
                public ISAUTHORRECOMMENDED: boolean = false,
                public ISPUBLISHED: boolean = false,
                public ACTIVATIONSTATUS: boolean = false,
                public IMAGEPATH?: string,
                public CREATEDDATE?: Date,
                public DOCID?: string,
                public CONTENT?: string) {
    }
}
