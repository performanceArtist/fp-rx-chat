# Chat

# Users

BigChungmire/test
sherk/test

## Architecture

1. Outside world and the data sources(http, sockets) - transport layer. Knows how to initialize connections and how to receive data(perhaps with some very general validation).
2. Store - knows how to use the data sources and how to store(cache) their results. Also could do some validation/mapping, but only when the mapping has a general purpose(e.g. shared or allows for an easy access). Stores are created together with the transport layer at the app initialization and are shared between the models.
3. Model - contains mappings of data from store(NOT from the data sources, that's important) + ui-specific behaviour. The model creation is bound to a particular component's lifecycle and manages the overall component state.
4. Container - binds data and handlers from Model to components.
5. View - has input and output - no logic other than pure view-related. All state should be handled on Model's level.

Each next layer should only know about the previous one, except for the container - it can use stores, if there is only need for a simple mapping and there is no user input + data input logic involved.

## Entities

1. Observable - a stream of values over time.
2. Input - input stream that produces another stream of values.
3. InputEffect - a side effect of an input stream(same as the Input, but there is no meaningful value in the output stream - only a side effect).
4. Behavior - a value that changes over time. Not sure if it belongs here yet. The inputs can't be duly expressed by behavior, since their initial value is not known. It can be set, but conceptually we can't say we have an input value before the user has done anything. We can only set the initial value to show something - but that is the view/container responsibility.
