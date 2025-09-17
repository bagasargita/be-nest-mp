import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentGatewayCategory {
	DISBURSEMENT = 'DISBURSEMENT',
	VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
	PAYMENT = 'PAYMENT',
	OTHERS = 'OTHERS',
}

@Entity('m_master_payment_gateway')
export class MasterPaymentGateway {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 100, unique: true })
	name: string;

	@Column({ type: 'enum', enum: PaymentGatewayCategory })
	category: PaymentGatewayCategory;

	@Column({ type: 'boolean', default: true })
	is_active: boolean;

    @Column({ length: 50 })
    created_by: string;

	@CreateDateColumn()
	created_at: Date;

    @Column({ length: 50, nullable: true })
    updated_by: string;
    
	@UpdateDateColumn()
	updated_at: Date;
}
