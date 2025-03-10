import { LoginRequest } from "./login-request.model";

describe('LoginRequest', () => {
  it('deve criar uma instância com valores padrão', () => {
    const loginRequest = new LoginRequest();
    expect(loginRequest).toBeTruthy();
    expect(loginRequest.email).toBe('');
    expect(loginRequest.password).toBe('');
  });

  it('deve criar uma instância com valores fornecidos', () => {
    const loginRequest = new LoginRequest('user@example.com', 'password123');
    expect(loginRequest).toBeTruthy();
    expect(loginRequest.email).toBe('user@example.com');
    expect(loginRequest.password).toBe('password123');
  });

  it('deve atualizar o email e a senha', () => {
    const loginRequest = new LoginRequest();
    loginRequest.email = 'newemail@example.com';
    loginRequest.password = 'newpassword123';

    expect(loginRequest.email).toBe('newemail@example.com');
    expect(loginRequest.password).toBe('newpassword123');
  });
});
