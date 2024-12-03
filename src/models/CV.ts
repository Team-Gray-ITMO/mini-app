import {ConnectionType} from "../enums/ConnectionType.ts";

export class CV {
    constructor(
        public snp: string,
        public phone: string,
        public email: string,
        public preferredConnectionType: ConnectionType,
        public dateOfBirth: Date,
        public city: string,
        public avatar: string,
        public education: string,
        public workExperience: string
    ) {
    }
}