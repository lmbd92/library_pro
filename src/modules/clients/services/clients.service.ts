import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../entities/client.entity';
import { CreateClientDto, UpdateClientDto } from '../dtos/requests';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientModel
      .findOne({ clientId: createClientDto.clientId })
      .exec();
    if (existingClient) {
      throw new HttpException(
        `Client with id ${createClientDto.clientId} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdClient = new this.clientModel(createClientDto);
    return await createdClient.save();
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .exec();
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  async remove(id: string): Promise<void> {
    const client = await this.clientModel.findByIdAndRemove(id).exec();
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
