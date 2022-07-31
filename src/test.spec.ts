import request from "supertest";
import { app } from "./app";

describe("All tests", () => {
  // Criar teste para enviar campos faltando, e deverá ter sucesso ao confirmar que a API irá recusar com status 400 e errorMessage
  it("Should not be able to send data without a obligatory parameter(name)", async () => {
    const response = await request(app)
      .post("/donation")
      .send({
        email: "test@test.com",
        phone: 77988001122,
        zip: 45100000,
        city: "city test",
        state: "state test",
        streetAddress: "street test",
        number: 12,
        complement: "complement test",
        neighborhood: "test",
        deviceCount: 1,
        devices: [
          {
            type: "type test",
            condition: "condition test",
          },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.errorMessage).toEqual(
      "Todos os campos obrigatórios devem ser informados"
    );
  });

  // Informar um email inválido, e confirmar que a API recusa com mensagem específica pra isso
  it("Should not be able to send email invalid", async () => {
    const response = await request(app)
      .post("/donation")
      .send({
        name: "test",
        email: "test.com",
        phone: 77988001122,
        zip: 45100000,
        city: "city test",
        state: "state test",
        streetAddress: "street test",
        number: 12,
        complement: "complement test",
        neighborhood: "test",
        deviceCount: 1,
        devices: [
          {
            type: "type test",
            condition: "condition test",
          },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.errorMessage).toEqual("O email não é válido!");
  });

  // Criar teste para enviar dados pessoais completos, mas não enviar devices
  it("Should not be able to send data without devices", async () => {
    const response = await request(app).post("/donation").send({
      name: "test",
      email: "test@test.com",
      phone: 77988001122,
      zip: 45100000,
      city: "city test",
      state: "state test",
      streetAddress: "street test",
      number: 12,
      complement: "complement test",
      neighborhood: "test",
      deviceCount: 1,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.errorMessage).toEqual(
      "O campo de 'devices' não é válido ou não foi informado!"
    );
  });

  // Criar teste que envie dados completos, e deviceCount for diferente da quantidade de itens enviados em devices, deverá retornar uma falha
  it("Should not be able to send data with deviceCount different from devices length", async () => {
    const data = {
      name: "test",
      email: "test@test.com",
      phone: 77988001122,
      zip: 45100000,
      city: "city test",
      state: "state test",
      streetAddress: "street test",
      number: 12,
      complement: "complement test",
      neighborhood: "test",
      deviceCount: 2,
      devices: [
        {
          type: "type test",
          condition: "condition test",
        },
      ],
    };

    const response = await request(app).post("/donation").send(data);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.errorMessage).toEqual(
      `A quantidade de equipamentos ${data.deviceCount} não está de acordo com as informações de equipamentos enviados ${data.devices.length}`
    );
  });

  // Criar teste que envie um type inválido
  it("Should not be able to send data with invalid type", async () => {
    const response = await request(app)
      .post("/donation")
      .send({
        name: "test",
        email: "test@teste.com",
        phone: 77988001122,
        zip: 45100000,
        city: "city test",
        state: "state test",
        streetAddress: "street test",
        number: 12,
        complement: "complement test",
        neighborhood: "test",
        deviceCount: 1,
        devices: [
          {
            test: "type test",
          },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.errorMessage).toEqual(
      "O campo de 'devices' não é válido ou não foi informado!"
    );
  });

  // Criar teste que envie dados e devices corretamente, que enfim retornará 200 e sucess
  it("Should be able to send data with devices", async () => {
    const response = await request(app)
      .post("/donation")
      .send({
        name: "test",
        email: "test@teste.com",
        phone: 77988001122,
        zip: 45100000,
        city: "city test",
        state: "state test",
        streetAddress: "street test",
        number: 12,
        complement: "complement test",
        neighborhood: "test",
        deviceCount: 1,
        devices: [
          {
            type: "type test",
            condition: "condition test",
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
