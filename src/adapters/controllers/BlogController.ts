import { inject, injectable } from "tsyringe";
import { IBlogInteractor } from "../../interfaces/blog/IBlogInteractor";

@injectable()
export class BlogController{
    constructor(@inject("IBlogInteractor") private interactor: IBlogInteractor){}
}