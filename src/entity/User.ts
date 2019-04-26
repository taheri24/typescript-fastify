import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];
}

@Entity()
export class Photo {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    url: string;
    
    @ManyToOne(type => User, user => user.photos)
    user: User;
    
}