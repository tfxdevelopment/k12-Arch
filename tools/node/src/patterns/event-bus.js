/**
 * Event Bus Implementation
 * Pub/Sub pattern for event-driven architecture
 */

class EventBus {
  constructor() {
    this.subscribers = new Map();
    this.asyncHandlers = true;
  }

  /**
   * Subscribe to an event
   * @param {String} eventType - Type of event to subscribe to
   * @param {Function} handler - Handler function
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, handler) {
    if (!eventType) {
      throw new Error('Event type is required');
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType).push(handler);

    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handler);
  }

  /**
   * Unsubscribe from an event
   * @param {String} eventType - Type of event
   * @param {Function} handler - Handler to remove
   */
  unsubscribe(eventType, handler) {
    if (!this.subscribers.has(eventType)) {
      return;
    }

    const handlers = this.subscribers.get(eventType);
    const index = handlers.indexOf(handler);
    
    if (index > -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.subscribers.delete(eventType);
    }
  }

  /**
   * Publish an event synchronously
   * @param {String} eventType - Type of event
   * @param {Object} data - Event data
   */
  publish(eventType, data = {}) {
    if (!eventType) {
      throw new Error('Event type is required');
    }

    const event = {
      type: eventType,
      data,
      timestamp: new Date(),
      id: this.generateEventId()
    };

    const handlers = this.subscribers.get(eventType) || [];
    
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
        this.emit('error', { eventType, error, event });
      }
    });

    return event;
  }

  /**
   * Publish an event asynchronously
   * @param {String} eventType - Type of event
   * @param {Object} data - Event data
   * @returns {Promise<Object>} Published event
   */
  async publishAsync(eventType, data = {}) {
    if (!eventType) {
      throw new Error('Event type is required');
    }

    const event = {
      type: eventType,
      data,
      timestamp: new Date(),
      id: this.generateEventId()
    };

    const handlers = this.subscribers.get(eventType) || [];
    
    await Promise.all(
      handlers.map(async handler => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`Error in async event handler for ${eventType}:`, error);
          this.emit('error', { eventType, error, event });
        }
      })
    );

    return event;
  }

  /**
   * Subscribe to all events
   * @param {Function} handler - Handler function
   * @returns {Function} Unsubscribe function
   */
  subscribeAll(handler) {
    return this.subscribe('*', handler);
  }

  /**
   * Get all event types with subscribers
   * @returns {Array<String>} Event types
   */
  getEventTypes() {
    return Array.from(this.subscribers.keys());
  }

  /**
   * Get subscriber count for an event type
   * @param {String} eventType - Type of event
   * @returns {Number} Number of subscribers
   */
  getSubscriberCount(eventType) {
    const handlers = this.subscribers.get(eventType);
    return handlers ? handlers.length : 0;
  }

  /**
   * Clear all subscribers
   */
  clear() {
    this.subscribers.clear();
  }

  /**
   * Clear subscribers for a specific event type
   * @param {String} eventType - Type of event
   */
  clearEventType(eventType) {
    this.subscribers.delete(eventType);
  }

  /**
   * Internal emit for bus-level events (like errors)
   * @param {String} eventType - Type of event
   * @param {Object} data - Event data
   */
  emit(eventType, data) {
    // Special handling for internal events
    const handlers = this.subscribers.get(eventType) || [];
    handlers.forEach(handler => handler(data));
  }

  /**
   * Generate a unique event ID
   * @returns {String} Event ID
   */
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = EventBus;
