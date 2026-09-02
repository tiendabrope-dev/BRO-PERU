export function obtenerPrecioOficialItem(
  item,
  precios
) {
  if (!item || !precios) {
    return Number(
      item?.precio || 0
    );
  }

  /*
    ==================================
    PRODUCTO DIGITAL
    ==================================
  */

  if (
    item.tipo === 'digital' ||
    item.wallpaperId
  ) {
    const wallpaperId =
      item.wallpaperId ||
      item.wallpaper?.id;

    const opcion =
      precios.wallpapers?.find(
        (wallpaper) =>
          wallpaper.id ===
          wallpaperId
      );

    if (!opcion) {
      return Number(
        item.precio || 0
      );
    }

    return Number(
      opcion.precio || 0
    );
  }

  /*
    ==================================
    PRODUCTO FÍSICO
    ==================================
  */

  const tamanoId =
    item.tamanoId;

  if (
    !tamanoId ||
    precios.tamanos?.[
      tamanoId
    ] === undefined
  ) {
    /*
      Carritos antiguos que no tengan
      tamanoId conservan su precio
      en vez de convertirse en S/0.
    */
    return Number(
      item.precio || 0
    );
  }

  const precioTamano =
    Number(
      precios.tamanos[
        tamanoId
      ] || 0
    );

  const adicionalMarco =
    item.marcoId
      ? Number(
          precios.marcos?.[
            item.marcoId
          ] || 0
        )
      : 0;

  return (
    precioTamano +
    adicionalMarco
  );
}

export function sincronizarPreciosCarrito(
  carrito,
  precios
) {
  let huboCambios = false;

  const actualizado =
    carrito.map((item) => {
      const precioOficial =
        obtenerPrecioOficialItem(
          item,
          precios
        );

      const precioActual =
        Number(
          item.precio || 0
        );

      if (
        precioOficial ===
        precioActual
      ) {
        return item;
      }

      huboCambios = true;

      return {
        ...item,
        precio:
          precioOficial,
      };
    });

  return huboCambios
    ? actualizado
    : carrito;
}