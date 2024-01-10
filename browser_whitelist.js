(async () => {
/* ========================================================================= */
  let addressPlaceholder = 'Введите ваш адрес';
  let namePlaceholder = 'мой кошелек';

/* ========================================================================= */
  const data =
// В ковычки адреса и имена
`0xD64BAc7de5FEE8320165198E6C755DbAb302D0B9	4
0xdCDF8Ed6AdA016FBbBeaaC9f2dBb9836E3796B3E	40
0xdecb558E0E199510f1D9a7D0F93Dd730D69Cddb2	98
0xEbc48dE650f14D9e184C469521291865CC5881a0	10
0xf05B0dD609420BF86476Da9804eBd56282f3C668	97
0xfA8d44DE0A487647284a652e95b226BB728Ea626	1
0xFd4839783893Ed78f7e7517680a4cd75C69A4D28	14`
// В ковычки адреса и имена
;

  /* ========================================================================= */
  // console.log(data);
  let arrayData = splitData(data);
  if (arrayData === false) return false;
  await addWallets(arrayData);

  /* ========================================================================= */
  //splitData
  function splitData(data) {
    // console.log(data);
    let array = data.replaceAll("\r\n", "\n").split("\n");
    if (array.length < 1 || array.length > 20) {
      console.log(array.length)
      alert('Количество кошельков больше 20 или меньше 1')
      return false;
    }
    return array;
  }

  /* ========================================================================= */
  // Создаем ячейки для кошельков
  async function addWallets(arrayData) {
    console.log(arrayData)
    let i = 0;

    const createAddressButton = document
    .querySelector('.withdraw-book-list .add-address-form-btn');


    for await (let wallet of arrayData) {
      if (i > 19) continue;
      createAddressButton.click();
      await pause(300);
    };

    await pause(1000);
    let inputs = document
      .querySelectorAll(`form .okui-form-item-md .okui-form-item-control .okui-input-box input.okui-input-input`);
    
    inputs = [...inputs];
    
    let addresses = inputs.filter(el => el.placeholder && 
      el.placeholder.includes(addressPlaceholder));

    let names = inputs.filter(el => el.placeholder && 
      el.placeholder.includes(namePlaceholder));      

    for await (let wallet of arrayData) {
      let [walletAddress, walletName] = wallet.split("\t");
      fillInput(addresses[i], walletAddress);
      if (walletName) fillInput(names[i], walletName)
      await pause(300);
      i++;
    };   

  };

  /* ========================================================================= */
  // fillInput
  function fillInput(input, value) {
    input.setAttribute('value', value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* ========================================================================= */
  // pause
  async function pause(ms) {
    return await new Promise(r => setTimeout(r, ms));
  }

  return alert("Ready");
})();