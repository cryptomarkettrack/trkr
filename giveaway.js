import readline from 'readline';

function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }
  

const giveaway = () => {
    let participants = ['@brielleanthonyk'
    ,'@liamswalkers'
    ,'@GirlThecrypto'
    ,'@Jessicaluu76'
    ,'@0xfahadsyed'
    ,'@nfthaider'
    ,'@darksoulsmadne1'
    ,'@grizzly98k'
    ,'@bethanysmiths56'
    ,'@anilkb1961'
    ,'@HimanshuH71'
    ,'@MarleyWhite17'
    ,'@kanakbhardwaj51'
    ,'@Zhiming08583421'
    ,'@iamupset12'
    ,'@amatrixable'
    ,'@ibilawalsyed'
    ,'@Hotoncrypt'
    ,'@zaqir45'
    ,'@omari0122'
    ,'@0xRyn27'
        , '@kamnabhardwaj21'];
    
    const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
    
rl.input.on('keypress', (key, data) => {
    // Check if the key is not null or undefined
    if (key) {
        shouldStop = true;
    }
});
    
    let shouldStop = false;
    
  (async function(){
      for (let i = 0; i < participants.length; i++){
      console.log(participants[i]);
          await wait(100);
          
          if (i === participants.length - 1 && !shouldStop) {
              i = 0;
          }
      }
      
      if(shouldStop){
        console.log('\n\n Congratulations @amatrixable.')
    }
    
    })();
    
   
}

giveaway();