async function deleteVoucher(element) {
    const voucherId = parseInt(element.dataset.voucherId, 0);
    const voucherRow = document.getElementById(voucherId.toString())

    const body = {
        voucherId: voucherId
    }

    await fetch('/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).finally(function () {
        voucherRow.remove()
    });
}

let voucherForm = document.getElementById('voucher_form');

if (typeof voucherForm != 'undefined' && voucherForm) {
    voucherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        var data = new FormData(e.target);

        document.getElementById('voucher_success').classList.add('d-none');
        document.getElementById('voucher_err').classList.add('d-none');

        fetch('/voucher/validate?code=' + data.get('code'))
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data) {
                    document.getElementById('voucher_success').classList.remove('d-none');
                } else {
                    document.getElementById('voucher_err').classList.remove('d-none');
                }
            });

    });
}


