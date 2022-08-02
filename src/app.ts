import express from "express";

const app = express();

app.use(express.json());

function validateEmail(email: string): boolean {
  var validate = /\S+@\S+\.\S+/;
  return validate.test(email);
}

function validateFields(value: any): boolean {
  if (value == null) {
    return false;
  }
  return value;
}

function validateDevices(devices: devices[]) {
  let type = true;
  let condition = true;

  if (devices == undefined) {
    return false;
  }

  for (var i = 0; i < devices.length; i++) {
    type =
      devices[i].type === types.filter((type) => type === devices[i].type)[i];
    condition =
      devices[i].condition ===
      conditions.filter((condition) => condition === devices[i].condition)[i];
    if (!type || !condition) {
      return false;
    }
  }
  return type && condition;
}

interface devices {
  type: string;
  condition: string;
}

const types = [
  "notebook",
  "desktop",
  "netbook",
  "screen",
  "printer",
  "scanner",
];

const conditions = ["working", "notWorking", "broken"];

const data: {
  name: string;
  email?: string;
  phone: number;
  zip: number;
  city: string;
  state: string;
  streetAddress: string;
  number: number;
  complement?: string;
  neighborhood: string;
  deviceCount: number;
  devices: devices[];
}[] = [];

// Criar rota POST /donation que receberá os dados em um único post
app.post("/donation", (request, response) => {
  const {
    name,
    email,
    phone,
    zip,
    city,
    state,
    streetAddress,
    number,
    complement,
    neighborhood,
    deviceCount,
    devices,
  } = request.body;

  // Validar se o endereço de email é válido
  if (email) {
    if (!validateEmail(email)) {
      return response
        .status(400)
        .json({ error: true, errorMessage: "O email não é válido!" });
    }
  }

  // Se algum campo faltar retornar status 400 com {error: true, requiredFields: [$field1, $field2, ...], errorMessage: "Todos os campos obrigatórios devem ser informados"}
  if (
    !validateFields(name) ||
    !validateFields(phone) ||
    !validateFields(zip) ||
    !validateFields(city) ||
    !validateFields(state) ||
    !validateFields(streetAddress) ||
    !validateFields(number) ||
    !validateFields(neighborhood) ||
    !validateFields(deviceCount)
  ) {
    return response.status(400).json({
      error: true,
      requiredFiels: [
        "name",
        "phone",
        "zip",
        "city",
        "state",
        "streetAddress",
        "number",
        "neighborhood",
        "deviceCount",
        "devices",
      ],
      errorMessage: "Todos os campos obrigatórios devem ser informados",
    });
  }

  // Validar se os devices estão chegando com os types corretos ou se não estão chegando
  if (!validateDevices(devices)) {
    return response.status(400).json({
      error: true,
      errorMessage: "O campo de 'devices' não é válido ou não foi informado!",
    });
  }

  // Se a quantidade de itens no array devices for diferente de deviceCount retornar status 400 com {error:true, errorMessage: "A quantidade de equipamentos ({$deviceCount}) não está de acordo com as informações de equipamentos enviados ({$sentDevices})"
  if (deviceCount != devices.length) {
    return response.status(400).json({
      error: true,
      errorMessage: `A quantidade de equipamentos ${deviceCount} não está de acordo com as informações de equipamentos enviados ${devices.length}`,
    });
  }

  data.push({
    name,
    email,
    phone,
    zip,
    city,
    state,
    streetAddress,
    number,
    complement,
    neighborhood,
    deviceCount,
    devices,
  });

  // Se todos os dados estiverem ok, consideraremos que houve sucesso e então retornaremos status 200 com json {success:true}
  return response.status(200).json({ success: true });
});

app.get("/donation", (request, response) => {
  return response.json(data);
});

export { app };
