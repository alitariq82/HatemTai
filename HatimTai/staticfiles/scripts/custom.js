$(document).ready(function(){

  // jQuery methods go here...

    setTimeout(()=>{
    $.ajax({
        url: '/hit_forex/',
        method: 'GET',
        success: function(){
            console.log('success')
        },
        error: function(){
            console.log('error')
        }
    })
  }, 1000)



});