import { inject, injectable } from "tsyringe";
import { IBlogInteractor } from "../interfaces/blog/IBlogInteractor";
import { IBlogRepository } from "../interfaces/blog/IBlogRepository";

@injectable()
export class BlogInteractor implements IBlogInteractor{
    constructor(@inject("IBlogRepository") private repository: IBlogRepository){}
}