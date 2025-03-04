import 'reflect-metadata';
import { container } from 'tsyringe';

import { IAuthRepository } from '../interfaces/auth/IAuthRepository';
import { AuthRepository } from '../adapters/repositories/AuthRepository';
import { IAuthInteractor } from '../interfaces/auth/IAuthInteractor';
import { AuthInteractor } from '../interactors/AuthInteractor';
import { AuthController } from '../adapters/controllers/AuthController';
import { IBlogRepository } from '../interfaces/blog/IBlogRepository';
import { BlogRepository } from '../adapters/repositories/BlogRepository';
import { IBlogInteractor } from '../interfaces/blog/IBlogInteractor';
import { BlogInteractor } from '../interactors/BlogInteractor';
import { BlogController } from '../adapters/controllers/BlogController';
import { IProfileRepository } from '../interfaces/profile/IProfileRepository';
import { ProfileRepository } from '../adapters/repositories/ProfileRepository';
import { IProfileInteractor } from '../interfaces/profile/IProfileInteractor';
import { ProfileInteractor } from '../interactors/ProfileInteractor';
import { ProfileController } from '../adapters/controllers/ProfileController';

container.register<IAuthRepository>("IAuthRepository", { useClass: AuthRepository });
container.register<IAuthInteractor>("IAuthInteractor", { useClass: AuthInteractor });
container.register<AuthController>("AuthController", { useClass: AuthController });


container.register<IBlogRepository>("IBlogRepository", {useClass: BlogRepository})
container.register<IBlogInteractor>("IBlogInteractor", {useClass: BlogInteractor})
container.register<BlogController>("BlogController", {useClass: BlogController})

container.register<IProfileRepository>('IProfileRepository', { useClass: ProfileRepository });
container.register<IProfileInteractor>('IProfileInteractor', { useClass: ProfileInteractor });
container.register<ProfileController>("BlogController", {useClass: ProfileController})

export default container;