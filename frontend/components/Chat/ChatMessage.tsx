import { ChatMessage } from '@common/types/models/chat.models'
import React, { FC } from 'react'

interface Props {
    message: ChatMessage
}

const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div>{!message.isSystemMessage? message.player.nickname : ""}: {message.text}</div>
  )
}

export default ChatMessage