const help = module.exports = {}

help.call = function(bot, message) {
  let helpText = ""
  helpText += "Type `/hello` - checks that Pigeon's properly installed\n"
  helpText += "Type `/cases`to list all current cases\n"
  helpText += "Type `/cases_pretty` to list all current cases color coded. Unassigned cases are red, cases with the 'needs attention' flag are orange, cases where the patient is awaiting a response are yellow, and otherwise cases are green.\n"
  helpText += "Type `/nextcase` to assign yourself an unassigned case. This will select the oldest unassigned active case.\n"
  helpText += "Type `/assign` to assign yourself to the channel you're in. Alternatively you can `/assign @user #some-case-channel`.\n"
  helpText += "Type `/flag` to apply a label to a case. If you don't provide a flag, 'needs attention' is the default.\n"
  helpText += "Type `/unflag` to remove flags from a case. Either call this from the channel you wish to unflag or provide a channel name.\n"
  helpText += "Type `/getflags` to view a list of all flags used by your team.\n"
  helpText += "Type `/success` to close a case and archive its channel.\n"
  helpText += "Type `/logout` to unassign all cases (ends their volunteer shift)."
  bot.replyPrivate(message, helpText)
}