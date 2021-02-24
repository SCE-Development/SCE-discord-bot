
const Discord = require('discord.js');
async function pagination(templateEmbed, channel, authorID, 
  fieldData, itemsPerPage = 5)
{
  /**
   * @description Information about the pages of the book.
   * @type {Page}
   */
  const page = {
    upperBound: itemsPerPage,
    lowerBound: 0,
    currentPage: 0,
    maxPage: Math.ceil(fieldData.length / itemsPerPage) - 1,
    itemsPerPage: itemsPerPage,
  };
  /**
   * @description An array of embeds each index is a page.
   * @type {Discord.RichEmbed[]}
   */
  let pageEmbeds = new Array(page.maxPage + 1);
  let pageMsg = await updatePage(fieldData, 
    pageEmbeds, templateEmbed, page, channel);

  if(page.maxPage <= 0){
    return ({type: 'message', pageMsg});
  }

  const filter = (reaction, user) => {
    return (
      ['⬅️', '➡️'].includes(reaction.emoji.name) &&
        user.id === authorID
    );
  };

  const reactionCollector = pageMsg.createReactionCollector(filter, {
    time: 300000,
  });

  const handlePageTurn = async reaction => {
    switch (reaction.emoji.name) {
      case '➡️':
        if (page.currentPage < page.maxPage) page.currentPage++;
        else page.currentPage = 0;
        break;
      case '⬅️':
        if (page.currentPage > 0) page.currentPage--;
        else page.currentPage = page.maxPage;
        break;
    }

    page.lowerBound = page.currentPage * itemsPerPage;
    page.upperBound = (page.currentPage + 1) * itemsPerPage;
    updatePage(fieldData, pageEmbeds, templateEmbed, page, channel, pageMsg);
        
    reaction.remove(reaction.users.last().id).catch(() => null);
  };
  reactionCollector.on('collect', handlePageTurn);
  await pageMsg.react('⬅️');
  await pageMsg.react('➡️');
  return { type: 'collector', collector: reactionCollector };
}

async function updatePage(fieldData, pageEmbeds, 
  templateEmbed, page, channel, pageMsg = null)
{
  if(pageEmbeds[page.currentPage] === undefined)
  {
    // initialize new embed according to template
    const newEmbed = new Discord.RichEmbed()
      .setTitle(templateEmbed.title)
      .setColor(templateEmbed.color)
      .setDescription(templateEmbed.description);
    for (const field of templateEmbed.fields){
      newEmbed.addField(field.name, field.value, field.inline);
    }
    for(const item of fieldData
      .slice(page.lowerBound, page.upperBound)){
      newEmbed.addField(item.title, item.field);
    }
    if (page.maxPage > 0)
      newEmbed.setFooter(
        `Page ${page.currentPage + 1} of ${page.maxPage + 1}`
      );
    pageEmbeds[page.currentPage] = newEmbed;
  }
  if(pageMsg === null)
  {
    return channel.send(pageEmbeds[page.currentPage]);
  }
  pageMsg.edit(pageEmbeds[page.currentPage]);
  return pageMsg;
}

module.exports = {
  pagination
};
