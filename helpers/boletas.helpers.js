const express = require('express');
const {Response} = require('express')
const Compra = require('../models/compras.model');
const numero = require('./nuevoNumero');



async function generarBoletas(cantidad, idPublicacion) {
  const boletas = [];
  const boletasExistentes = [];

  // haciendo busqueda de las boletas vendidas filtrado por anuncio
  const boletasCompradas = await Compra.find(
    { idPublicacion: idPublicacion },
    "boletas"
  ).select("boletas");
  

  // pushando las boletas encontradas en la busqueda (Boletas compradas) en boletas existentes
  boletasCompradas.forEach((element) => {
    element.boletas.forEach((numero) => {
      // +numero
      // console.log('aqui', numero);
      boletasExistentes.push(numero);
    });
  });


  //  Delimita la cantidad de boletas maximas en la base de datos
    // todo : igualar a 9999 al finalizar las pruebas 
  if (boletasExistentes.length >= 20) {
    throw new Error("No Hay mas Boletas para vender");
  }

  console.log(boletasExistentes);

  

  // Función para generar un número aleatorio entre 1 y 20 sin repetir con las boletas existentes
  function generarBoletaAleatoria() {
    let numeroAleatorio;
    do {
        // todo: Cambiar el numero al maximo de boletas a vender 
      numeroAleatorio = Math.floor(Math.random() * 20) + 1;
    } while (
      boletasExistentes.includes(numeroAleatorio) ||
      boletas.includes(numeroAleatorio)
    );
    return numeroAleatorio;
  }

  // Generar  boletas al azar segun la cantidad recibida en los argumento
  for (let i = 0; i < cantidad; i++) {
    const boletaAleatoria = generarBoletaAleatoria();
    boletas.push(boletaAleatoria);
  }

  return boletas;
}


  
 


module.exports = generarBoletas