# KJO Mind Care - Dashboard de Administración 🧠📊

Este dashboard fue desarrollado como parte del proyecto de bienestar emocional **KJO Mind Care**. Permite a administradores gestionar los recursos del sistema (blogs, usuarios, categorías, centros de salud, etc.) desde un entorno seguro, intuitivo y moderno.

## 🛠 Tecnologías Usadas

- Angular 19 (con standalone components)

- Keycloak

- TailwindCSS + DaisyUI

- OpenLayers (para mapas)

- GitHub Actions (CI/CD)

## 📦 Casos de Uso

| Caso de Uso                    | Descripción                                                   | Rol           |
|:-------------------------------|:--------------------------------------------------------------|:--------------|
| Ver usuarios                   | Lista completa de usuarios registrados                        | Administrador |
| Editar usuario                 | Actualizar nombre, estado o rol de un usuario                 | Administrador |
| Mantener blog                  | Visualizar todos los blogs, crearlos, editarlos y eliminarlos | Administrador |
| Mantener categorías            | Visualizar, crear, editar categorías                          | Administrador |
| Mantener Comentarios           | Visualizar, crear, editar y eliminar comentarios de los blogs | Administrador |
| Mantener centros de salud      | Visualizar, crear, editar y eliminar centros de salud         | Administrador |
| Mantener estados de ánimo      | Visualizar, crear, editar estados de ánimo                    | Administrador |
| Visualizar estadísticas de uso | Panel de métricas del sistema                                 | Administrador |

## 🚀 Características del Dashboard

- CRUD completo para blogs, usuarios, recursos de emergencia y centros de salud.

- Mapa interactivo con OpenLayers para localizar centros de atención cercanos.

- Visualización de métricas sobre el uso de la plataforma (usuarios, blogs, estados de ánimo).

- Integración con Keycloak para la autenticación.

- Interfaz responsiva y amigable.

## ⚙️ Guia de instalación:
### Requisitos Previos
Antes de iniciar, asegúrate de contar con los siguientes requisitos instalados en tu sistema:

- Docker: Para la creación y gestión de contenedores.
- Docker Compose: Para la orquestación de múltiples contenedores.
- Git: Para la clonación de los repositorios del proyecto.
- Java 17 o superior: Requerido para ejecutar las aplicaciones Spring Boot.
- Node.js y bun: Necesarios para el entorno de desarrollo de Angular.

### Clonación de Repositorios

Clona los repositorios del backend y frontend desde GitHub:

```bash
git clone https://github.com/KJO-Tech/kjo-care-back.git
git clone https://github.com/KJO-Tech/kjo-care-front.git
```

### Configuración de Variables de Entorno

Es necesario configurar variables de entorno tanto para el backend como para el frontend. A continuación, se detallan las variables requeridas:

#### Backend (kjo-care-back)

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

```text
# PostgreSQL
POSTGRES_DB=keycloak
POSTGRES_USER=postgres
POSTGRES_PASSWORD=securepassword123

# Keycloak Admin
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=adminpassword123

# Keycloak Client
KEYCLOAK_SERVER_URL=http://keycloak:9090
KEYCLOAK_REALM=kjo-care-realm-dev
KEYCLOAK_MASTER_REALM=master
KEYCLOAK_ADMIN_CLIENT=admin-cli
KEYCLOAK_HOSTNAME=localhost
KEYCLOAK_CLIENT_ID=kjo-care-client

# Cloudinary
CLOUDINARY_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Asegúrate de completar los valores de Cloudinary con tus credenciales correspondientes.

#### Frontend (kjo-care-front)

En la raíz del proyecto frontend, crea un archivo .env con el siguiente contenido:

```text
NG_APP_API_URL=http://localhost:8080/api/mind
NG_APP_KEYCLOAK_URL=http://localhost:9090
NG_APP_KEYCLOAK_REALM=kjo-care-realm-dev
NG_APP_KEYCLOAK_CLIENT_ID=kjo-care-client
```

### Levantamiento del Entorno

Sigue los siguientes pasos para levantar el entorno completo:

1. **Backend:**

   - Navega al directorio del backend: `cd kjo-care-back`
   - Construye y levanta los contenedores: `docker-compose up --build`
   - Este comando iniciará los microservicios, Keycloak y PostgreSQL, configurando las bases de datos y el realm de Keycloak automáticamente.

2. **Frontend:**

   - En una nueva terminal, navega al directorio del frontend: `cd kjo-care-front`
   - Instala las dependencias de Node.js: `bun install`
   - Inicia la aplicación Angular: `ng serve`
   - La aplicación estará disponible en http://localhost:4200.
