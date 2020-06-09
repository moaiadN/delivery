function deleteOrder() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    axios.delete('/orders/delete/' + id)
        .then((res) => {
            console.log(res.data)
            alert('order was deleted')
            window.location.href = '/orders'
        })
        .catch((err) => {
            console.log(err)
        })
}


//upload avatar 
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let image = document.getElementById("imagePlaceholder")
            image.style.display = "block"
            image.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
}