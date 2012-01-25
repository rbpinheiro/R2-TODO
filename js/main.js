(function($) {
    /*
    {
        length: 1,
        todo: [
            {
                title: 'test',
                description: 'test'
            }
        ],
        done: [
            {
                title: 'test1',
                description: 'test2'
            }
        ]
    }
    */
    function Storage(storage) {
        this.storage = storage || localStorage;
        this.key = new Date().toDateString();
        if (this.storage.getItem(this.key) === null) {
            this.storage.setItem(this.key, JSON.stringify({todo:[], done:[]}));
        }
    }

    Storage.prototype = {
        add: function(value, type) {
            var type = type || 'todo';
            var items = JSON.parse(this.storage.getItem(this.key));
            items[type].push(value);
            this.storage.setItem(this.key, JSON.stringify(items));
            return true;
        },
        get: function(index, type) {
            var type = type || 'todo';
            var items = JSON.parse(this.storage.getItem(this.key))[type];
            return items[index];
        },
        getAll: function(type) {
            var type = type || 'todo';
            return JSON.parse(this.storage.getItem(this.key))[type];
        },
        load: function(key) {
            this.key = key;
            list.refresh();
        }
    };
    
    function TaskForm() {
        this.element = $('#new-task');
        this.bindEvents();
    }
    
    TaskForm.prototype = {
        bindEvents: function() {
            var self = this;
            this.element.bind('submit', function(ev) {
                ev.preventDefault();
                self.save();
                return false;
            });
        },
        save: function() {
            var title = this.element.find('#title').val();
            var description = this.element.find('#description').val();
            if (title.trim() !== '') {
                if (storage.add({title:title, description:description})) {
                    this.element.get(0).reset();
                    list.refresh();
                }
            }
        }
    };
    
    function FluxCapacitor() {
        this.element = $('#flux-capacitor');
        this.load();
    }
    
    FluxCapacitor.prototype = {
        load: function() {
            var html = '';
            $.each(storage.storage, function(i) {
                html += '<option value="' + storage.storage[i] + '">' + storage.storage[i] + '</option>';
            });
            this.element.html(html);
            this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            this.element.bind('change', function() {
                storage.load(self.element.val());
            });
        }
    };
    
    function TaskList() {
        this.element = $('#task-list');
        this.load();
    }
    
    TaskList.prototype = {
        load: function() {
            this.refresh();
        },
        refresh: function() {
            var items = storage.getAll();
            var html = '';
            $.each(items, function(i) {
                html += '<li><p class="title">' + items[i].title + '</p><p class="description">' + items[i].description.replace('\n', '<br />') + '</p></li>'
            });
            this.element.html(html);
        }
    };
    
    var storage = new Storage();
    var list = new TaskList();
    var form = new TaskForm();
    var fluxCapacitor = new FluxCapacitor();

})(jQuery);