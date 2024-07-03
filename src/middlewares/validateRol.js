export const validRol = async (rol) => {
    const validRol = ["gerente", "usuario"];
    if (!validRol.incluides(rol)) {
        return true;
    } else{ 
        return false;
    }
}

export const validRolAdmin = async (rolAdmin) => {
    const validRolAdmin = ["administrador", "caja"];
    if (!validRolAdmin.incluides(rolAdmin)) {
        return true;
    } else{
        return false;
    }
}