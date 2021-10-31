function makeMyContent()
{
    const bot = new Bot();
    let i=0;
    let j=0;

    bot.positionY = 2;
    bot.positionZ = -2;
    for(j=0; j<20; j++)
    {
        for(i=0; i<=4; i++)
        {
            bot.drawBox(1, 1, 1);
            bot.moveUp(1);
            bot.forward(1);
        }

        console.log("turning by 90....................................");
        console.log("current angle = " + bot.getAngle())
        bot.turn(90);    
    }


}
