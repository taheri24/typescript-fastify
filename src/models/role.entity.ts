import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type:'json'})
    securityData:any;
 
}
