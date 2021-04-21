const Discord = require('discord.js');
const { deleteMessage } = require('../util/messages');
const { LONG_WAIT } = require('../util/constants');

const PAGE_LIMIT = 32;

/**
 * Sends a message with emojis for a user to turn pages.
 */
class PaginatedMessage {
  /**
   * @param {Discord.TextChannel} channel Channel to send the message in.
   * @param {Discord.User} user User who can turn the pages.
   * @param {[Object]} fieldData Array of fields: { title, field }
   * @param {Discord.RichEmbed?} templateEmbed Embed to copy settings and fields
   * from.
   * @param {Number} keepAlive Time to wait before automatically deleting.
   * @param {Number} itemsPerPage Number of items per page.
   */
  constructor(
    channel,
    user,
    fieldData,
    { templateEmbed = null, keepAlive = LONG_WAIT, itemsPerPage = 5 } = {}
  ) {
    this.channel = channel;
    this.user = user;
    this.fieldData = fieldData;
    this.templateEmbed = templateEmbed || new Discord.RichEmbed();
    this.keepAlive = keepAlive;
    this.itemsPerPage = itemsPerPage;
  }

  /**
   * Sends this paginated message.
   *
   * @throws If the number of pages exceeds PAGE_LIMIT
   * 
   * @returns {Promise<boolean>} Whether the message was sent.
   */
  async send() {
    const {
      channel,
      user,
      fieldData,
      templateEmbed,
      keepAlive,
      itemsPerPage,
    } = this;

    /**
     * Helper function to update pages.
     *
     * @param {Object} page Information about the current page.
     * @param {[Discord.RichEmbed]} pageEmbeds Stored embeds.
     * @param {Discord.Message?} pageMsg Message displaying the pages.
     *
     * @returns {Promise<Discord.Message>} Message displaying the pages.
     */
    const updatePage = async (page, pageEmbeds, pageMsg = null) => {
      if (!pageEmbeds[page.currentPage]) {
        // initialize new embed according to template
        const newEmbed = new Discord.RichEmbed()
          .setTitle(templateEmbed.title)
          .setColor(templateEmbed.color)
          .setDescription(templateEmbed.description);
        for (const field of templateEmbed.fields) {
          newEmbed.addField(field.name, field.value, field.inline);
        }
        for (const item of fieldData.slice(page.lowerBound, page.upperBound)) {
          newEmbed.addField(item.title, item.field);
        }
        if (page.maxPage > 0)
          newEmbed.setFooter(
            `Page ${page.currentPage + 1} of ${page.maxPage + 1}`
          );
        pageEmbeds[page.currentPage] = newEmbed;
      }
      if (!pageMsg) {
        return channel.send(pageEmbeds[page.currentPage]);
      }
      pageMsg.edit(pageEmbeds[page.currentPage]);
      return pageMsg;
    };

    /**
     * @description Information about the pages of the book.
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
     * @type {[Discord.RichEmbed]}
     */
    const pageEmbeds = new Array(page.maxPage + 1);
    const pageMsg = await updatePage(page, pageEmbeds);

    if (page.maxPage <= 0) {
      deleteMessage(pageMsg, keepAlive);
      this.toDelete = pageMsg;
      return true;
    }

    if (page.maxPage > PAGE_LIMIT) {
      throw `Error: ${page.maxPage} exceeds the page limit of ${PAGE_LIMIT}`;
    }

    const filter = (reaction, reactingUser) => {
      return (
        ['⬅️', '➡️'].includes(reaction.emoji.name) &&
        reactingUser.id === user.id
      );
    };

    const reactionCollector = pageMsg.createReactionCollector(filter, {
      time: keepAlive,
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
      updatePage(page, pageEmbeds, pageMsg);

      reaction.remove(reaction.users.last().id).catch(() => null);
    };
    reactionCollector.on('collect', handlePageTurn);
    reactionCollector.on('end', () => deleteMessage(pageMsg));
    await pageMsg.react('⬅️');
    await pageMsg.react('➡️');

    this.toDelete = reactionCollector;
    return true;
  }

  /**
   * Deletes the paginated message.
   *
   * @returns {boolean} Whether the message was deleted.
   */
  delete() {
    const { toDelete } = this;

    if (!toDelete) return false;

    if (toDelete instanceof Discord.Message) {
      deleteMessage(toDelete);
      this.toDelete = undefined;
    } else if (toDelete instanceof Discord.Collector) {
      toDelete.stop(['Paginated Message stopped']);
      this.toDelete = undefined;
    } else {
      throw `Error: could not delete ${toDelete}`;
    }

    return true;
  }
}

module.exports = PaginatedMessage;
