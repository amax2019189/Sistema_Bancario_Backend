export const validRol = async (rol) => {
    const validRol = ["gerente", "administrador", "caja"];
    if (!validRol.incluides(rol)) {
        return true;
    } else{ 
        return false;
    }
}

export const 