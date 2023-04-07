function makeMyContent()
{
    const bot = new Bot();
    let i=0;
    let j=0;

    for(j=0; j<40; j++)
    {
        for(i=0; i<=4; i++)
        {
            bot.drawBox(0.8, 2, 0.8);
            bot.moveUp(1);
            bot.forward(1);
        }

        console.log("turning by 90....................................");
        console.log("current angle = " + bot.getAngle())
        bot.turn(90);    
    }


}
