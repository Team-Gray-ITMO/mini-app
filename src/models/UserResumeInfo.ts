export class UserResumeInfo {
    constructor(
        public name: string,
        public phone: string,
        public email: string,
        public dateOfBirth: string,
        public city: string,
        public avatar: string,
        public education: [],
        public workExperience: [],
    ) {
    }
}