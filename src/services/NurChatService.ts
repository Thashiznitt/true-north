import { supabase } from './supabase';
import { ChatMessage } from '../store';

export const NurChatService = {
  /**
   * Pushes a new message to the cloud for a specific user.
   */
  pushMessage: async (userId: string, message: ChatMessage): Promise<void> => {
    try {
      const { error } = await supabase
        .from('nur_chats')
        .insert([
          {
            user_id: userId,
            message_id: message.id,
            role: message.role,
            content: message.content,
            timestamp: new Date(message.timestamp).toISOString(),
            metadata: message.metadata || {}
          }
        ]);

      if (error) {
        console.error('[NurChatService] Error pushing message:', error.message);
      }
    } catch (e) {
      console.error('[NurChatService] Unexpected error pushing message:', e);
    }
  },

  /**
   * Pulls the entire chat history for a specific user.
   */
  pullHistory: async (userId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('nur_chats')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('[NurChatService] Error pulling history:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.message_id,
        role: row.role,
        content: row.content,
        timestamp: new Date(row.timestamp).getTime(),
        metadata: row.metadata
      }));
    } catch (e) {
      console.error('[NurChatService] Unexpected error pulling history:', e);
      return [];
    }
  },

  /**
   * Clears the chat history for a specific user on the cloud.
   */
  clearHistory: async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('nur_chats')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('[NurChatService] Error clearing history:', error.message);
      }
    } catch (e) {
      console.error('[NurChatService] Unexpected error clearing history:', e);
    }
  }
};
