# 🎰 Casino Game Peaky blinders

## 📌 Descripción del proyecto

Este es un casino desplegado en Railway, inspirado en la serie Peaky Blinders emitida por BBC Two y ambientada en los años 20. El casino cuenta con un registro en el cual el usuario debe registrarse para empezar a jugar. Al registrarse, puede elegir entre ser un usuario normal o Premium.

La gran diferencia entre estos dos tipos de usuario es que el Premium juega con dinero real, introduciendo los datos de su tarjeta bancaria. Además, los usuarios Premium tienen acceso a un juego adicional exclusivo. En cambio, el usuario normal tiene solo dos juegos disponibles y juega con dinero ficticio, el cual no se puede retirar.

Los juegos disponibles son:

Usuario normal: Una tragaperras y una carrera de caballos, ambas inspiradas en la serie.

Usuario Premium: Accede a los juegos anteriores más una ruleta exclusiva donde apuesta con dinero real.

Todos los juegos son intuitivos, con botones fáciles de utilizar y modales que notifican al usuario tanto si ha ganado como si ha perdido. Además, existen alertas de errores para mejorar la experiencia del usuario.

## 🚀 Tecnologías utilizadas

- *Java 17*
- *Spring Boot 3.4.2*
- *Spring Data JPA*
- *MySQL*
- *Hibernate*
- *Maven*
- *Railway* (para hosting de la base de datos)


## ⚙ Configuración del proyecto

### ⿡ Clonar el repositorio
sh
 git clone https://github.com/Manuel10103/Transversal.Isma.Golderos.git


### ⿢ Configurar la base de datos
#### 🔹 *Railway*

spring.datasource.url=jdbc:mysql://shinkansen.proxy.rlwy.net:44922/railway?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=KaVleozUaUBdCMSckbvgaZEVWTklOpqu
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver



## ▶ Cómo ejecutar el proyecto

Ejecuta los siguientes comandos en la terminal:
sh
mvn clean install  
mvn spring-boot:run 
```
Por defecto, el servidor se ejecutará en *http://localhost:8080*.


## 📌 Autores

- *ISMAEL PATON CRESPO* 
- *MANUEL GOLDEROS CAÑIZARES*
