import Swal from "sweetalert2";

const fireSuccessDialog = (message:string) => {
    Swal.fire('Correcto',message,'success')
}

const fireErrorDialog = (message:string) => {
   return Swal.fire('Error',message,'error')
}



export {fireSuccessDialog,fireErrorDialog}