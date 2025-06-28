import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-users.dto';
import { User } from './users.entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
   constructor (
    @InjectRepository(User)
    private userRepository : Repository< User>
   ){}
    // private users = [
    //     {
    //         "id": 1,
    //         "name": "Leanne Graham",
    //         "email": "scincere@april.biz",
    //         "role": "INTERN",
    //         "password":"hellow"
    //     },
    //     {
    //         "id": 2,
    //         "name": "ervin howell",
    //         "email": "shaab@email.tv",
    //         "role": "ENGINEER",
    //         "password":"hell123"
    //     },
    //     {
    //         "id": 3,
    //         "name": "sufiyan",
    //         "email": "sufiyan@123",
    //         "role": "ADMIN",
    //         "password":"kikap"
    //     },

    // ]
   // eslint-disable-next-line @typescript-eslint/require-await
   async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {

           const rolesArray = this.users.filter(user => user.role === role)
           if(rolesArray.length==0){
        throw new NotFoundException('user not found');
                return rolesArray
           }
        }
        return this.users
    }
    findOne(id: number) {
        const user = this.users.find(user => user.id === id)

        if (!user) throw new NotFoundException('user not found')

        return user
    };
    create(createUserDto: CreateUserDto) {
        const usersByHighestId
            = [... this.users].sort((a, b) => b.id - a.id)
        const newUser = {
            id: usersByHighestId[0].id + 1,
            ...createUserDto
        }
        this.userRepository.save(newUser)
    }
    update(id: number, updateUserDto: UpdateUserDto) {
        interface UpdatedUser {
            id: number;
            name: string;
            email: string;
            role: 'INTERN' | 'ENGINEER' | 'ADMIN';
            password: string;
        }

        this.users = this.users.map((user: UpdatedUser): UpdatedUser => {
            if (user.id === id) {
            return { ...user, ...updateUserDto }
            }
            return user
        })
        return this.findOne(id)
    }
    delete(id: number) {
        const removedUser = this.findOne(id)

        this.users = this.users.filter(user => user.id !== id)
        return removedUser
    }
}
